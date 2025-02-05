const { Sequelize, DataTypes, QueryTypes, where, Op } = require("sequelize");
const { responseError, responseSuccess } = require('../helper/responce')
const fs = require('fs');
const path = require('path');
const xlsx = require('xlsx');



// insert bulk upload of attendance 
exports.bulkUpload = async (req, res) => {
    const process = await req.config.sequelize.transaction();
    try {
        let data = req.body
        let dataFlow = await req.config.userAttandance.bulkCreate(data, { transaction: process })
        await process.commit();
        return responseSuccess(req, res, "bulk entry updated successfuly", dataFlow)
    } catch (error) {
        logErrorToFile(error)
        await process.rollback();
        console.log(error)
        return responseError(req, res, "Something Went Wrong")
    }
}

exports.singleCheck = async (req, res) => {
    try {

        let data = req.body
        data.user_id = req.user.user_id
        let checkUser = await req.config.userAttandance.findOne({
            where: {
                user_id: req.user.user_id,
                check_in: {
                    [Op.gte]: data.start_date, // Greater than or equal to current date at midnight
                    [Op.lt]: data.end_date// Less than current date + 1 day at midnight
                }
            }
        })
        if (checkUser) return responseError(req, res, "already checked in successfuly", checkUser)
        let check_in = await req.config.userAttandance.create(data)
        return responseSuccess(req, res, "checked in successfuly", check_in)
    } catch (error) {
        logErrorToFile(error)
        console.log(error)
        return responseError(req, res, "Something Went Wrong")
    }
}

exports.CheckOut = async (req, res) => {
    try {
        let data = req.body
        data.user_id = req.user.user_id
        let checkUser = await req.config.userAttandance.findOne({
            where: {
                user_id: req.user.user_id,
                check_in: {
                    [Op.gte]: data.start_date, // Greater than or equal to current date at midnight
                    [Op.lt]: data.end_date// Less than current date + 1 day at midnight
                }
            }
        })
        if (!checkUser) return responseError(req, res, "You havent checked in yet")
        if (checkUser.check_out == null) {
            await checkUser.update(data)
            return responseSuccess(req, res, "checked out successfuly")
        } else {
            return responseError(req, res, "already checked out")
        }
    } catch (error) {
        logErrorToFile(error)
        console.log(error)
        return responseError(req, res, "Something Went Wrong")
    }
}



exports.checkUser = async (req, res) => {
    try {
        let checkUser = await req.config.userAttandance.findOne({
            where: {
                user_id: req.user.user_id,
                check_in: {
                    [Op.gte]: req.query.start_date, // Greater than or equal to current date at midnight
                    [Op.lt]: req.query.end_date// Less than current date + 1 day at midnight
                }
            }
        })
        if (!checkUser) {
            return res.status(201).json({ message: 'Not Logged In', data: null, status: 400 })
        } else {
            return responseSuccess(req, res, "user logged in", checkUser)
        }
    } catch (error) {
        logErrorToFile(error)
        console.log(error)
        return responseError(req, res, "Something Went Wrong")
    }
}

const dateChange = (date) => {
    const dueDate = new Date(date);
    const day = dueDate.toLocaleDateString('en-US', { day: '2-digit' });
    const month = dueDate.toLocaleDateString('en-US', { month: '2-digit' });
    const year = dueDate.toLocaleDateString('en-US', { year: 'numeric' });
    const hours = dueDate.toLocaleTimeString('en-US', { hour: '2-digit', hour12: false });
    const minutes = dueDate.toLocaleTimeString('en-US', { minute: '2-digit' });
    const seconds = dueDate.toLocaleTimeString('en-US', { second: '2-digit' });
    return `${day}-${month}-${year} ${hours}:${minutes}:${seconds}`;
}



exports.downloadExcelData = async (req, res) => {
    try {

        let whereUserCaluse = {};
        if (!req.user.isDB) {
            whereUserCaluse = {
                report_to: req.user.user_id,
            }
        }

        let checkUser = await req.config.userAttandance.findAll({
            include: [
                { model: req.config.users, where: whereUserCaluse }
            ],
            order: [
                ['check_in', 'DESC']
            ]
        })
        let excelClientData = []
        checkUser?.forEach(element => {
            let item = {
                "User Name": element?.dataValues?.db_user?.dataValues.user,
                "Check In": dateChange(element?.dataValues.check_in),
                "Check Out": dateChange(element?.dataValues.check_out),
                "latitude": element?.dataValues.lat,
                "longitude": element?.dataValues.lon,
            }
            excelClientData.push(item)
        });
        // let excelClientData = lead?.map((item)=> item.dataValues)
        const workbook = xlsx.utils.book_new();
        const worksheet = xlsx.utils.json_to_sheet(excelClientData);
        // Add the worksheet to the workbook
        xlsx.utils.book_append_sheet(workbook, worksheet, 'Sheet1');

        // Generate a temporary file path to save the Excel workbook
        const tempFilePath = path.join(__dirname, `../uploads/temp`, 'temp.xlsx');

        // Write the workbook to a file
        xlsx.writeFile(workbook, tempFilePath);

        // Set the response headers
        res.setHeader('Content-Type', 'application/vnd.ms-excel');
        res.setHeader('Content-Disposition', 'attachment; filename=example.xlsx');

        // Stream the file to the response
        const stream = fs.createReadStream(tempFilePath);
        stream.pipe(res);

        // Delete the temporary file after sending the response
        stream.on('end', () => {
            fs.unlinkSync(tempFilePath);
        });

        return
    } catch (error) {
        logErrorToFile(error)
        console.log(error)
        return res.status(400).json({ status: 400, message: "Something Went Wrong" })
    }
}

exports.reportAttendance = async (req, res) => {
    try {

        let whereCaluse = {}
        let whereUserCaluse = {}
        if (req.user.isDB) {

        } else {
            whereUserCaluse.report_to = req.user.user_id
        }

        if (req.query.user_id && req.query.user_id != "null" && req.query.user_id != "undefined") {
            whereCaluse.user_id = req.query.user_id
        }

        if (req.query.from_date && req.query.to_date && req.query.from_date != "null" && req.query.from_date != "undefined" && req.query.to_date != "null" && req.query.to_date != "undefined") {
            whereCaluse.check_in = {
                [Op.gt]: req.query.from_date, // Greater than or equal to current date at midnight
                [Op.lt]: req.query.to_date// Less than current date + 1 day at midnight
            }

        }


        let checkUser = await req.config.userAttandance.findAll({
            where: whereCaluse,
            include: [
                { model: req.config.users, where: whereUserCaluse }
            ],
            order: [
                ['check_in', 'DESC']
            ]
        })

        return responseSuccess(req, res, "user logged in", checkUser)

    } catch (error) {
        logErrorToFile(error)
        console.log(error)
        return responseError(req, res, "Something Went Wrong")
    }
}