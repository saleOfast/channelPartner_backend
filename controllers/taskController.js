const { Sequelize, DataTypes, QueryTypes, where, Op } = require("sequelize");
const { responseError, responseSuccess } = require('../helper/responce')
const fs = require('fs');
const path = require('path');
const xlsx = require('xlsx');

exports.storeTask = async (req, res) => {
    try {
        let tasksBody = req.body
        let tasksData;
        let count = await req.config.tasks.count()
        tasksBody.created_by = req.user.user_id
        tasksBody.task_code = `TA000${count}`

        tasksData = await req.config.tasks.findOne({
            where: {
                task_name: tasksBody.task_name,
                assigned_to: tasksBody.assigned_to
            }
        })

        if (tasksData) return await responseError(req, res, "task already asigned to this user")

        tasksData = await req.config.tasks.create(tasksBody)
        return await responseSuccess(req, res, "task asigned Succesfully", tasksData)

    } catch (error) {
        logErrorToFile(error)
        console.log(error)

        return await responseError(req, res, "Something Went Wrong")
    }
}

const dateChange = (date) => {
    const dueDate = new Date(date);
    const formattedDueDate = dueDate.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' });
    return formattedDueDate
}


exports.downloadExcelData = async (req, res) => {
    try {

        let whereClause = {};
        let commonExclude = ["createdAt", "updatedAt", "deletedAt"];
        if (!req.user.isDB) {
            whereClause = {
                [Op.or]: [
                    { assigned_to: req.user.user_id },
                    { created_by: req.user.user_id }
                ]
            }
        }
        let tasks = await req.config.tasks.findAll({
            where: whereClause,
            include: [
                { model: req.config.taskStatus, paranoid: false, },
                { model: req.config.taskPriority, paranoid: false, },
                {
                    model: req.config.users, as: "createdByUser", attributes: {
                        exclude: ['password']
                    }, paranoid: false,
                },
                {
                    model: req.config.users, as: "assignedToUser", attributes: {
                        exclude: ['password']
                    }, paranoid: false
                },
                { model: req.config.opportunities, as: "linkWithOpportunity", paranoid: false, },
                { model: req.config.leads, paranoid: false },
            ], order: [
                ['task_id', 'DESC']
            ]
        })
        //console.log("lead", lead[0].dataValues.db_department.dataValues.department)
        // console.log('lead', lead);
        let excelClientData = []
        tasks?.forEach(element => {
            let item = {
                "Name": element?.dataValues?.task_name,
                "Description": element?.dataValues?.description,
                "Due Date": dateChange(element?.dataValues?.due_date),
                "Status": element?.dataValues?.db_task_status?.dataValues?.task_status_name,
                "Priority": element?.dataValues?.db_task_priority?.dataValues?.task_priority_name,
                "Created By": element?.dataValues?.createdByUser?.dataValues?.user,
                "Assigned To": element?.dataValues?.assignedToUser?.dataValues.user,
                "Lead Name": element?.dataValues?.db_lead?.dataValues?.lead_name,
                "Opportunity Name": element?.dataValues?.linkWithOpportunity?.dataValues.opp_name,
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


exports.getTask = async (req, res) => {
    try {
        let tasks;
        let whereClause = {};
        if (!req.user.isDB) {
            whereClause = {
                [Op.or]: [
                    { assigned_to: req.user.user_id },
                    { created_by: req.user.user_id }
                ]
            }
        }

        if (req.query.t_id) {
            tasks = await req.config.tasks.findOne({
                where: {
                    task_id: req.query.t_id
                },
                include: [
                    { model: req.config.taskStatus, paranoid: false, },
                    { model: req.config.taskPriority, paranoid: false, },
                    {
                        model: req.config.users, as: "createdByUser", attributes: {
                            exclude: ['password']
                        }, paranoid: false,
                    },
                    {
                        model: req.config.users, as: "assignedToUser", attributes: {
                            exclude: ['password']
                        }, paranoid: false,
                    },

                    { model: req.config.opportunities, as: "linkWithOpportunity", paranoid: false, },
                    { model: req.config.leads, paranoid: false },
                ], order: [
                    ['task_id', 'DESC']
                ]
            })
        }
        if (req.query.link_with_opportunity) {
            tasks = await req.config.tasks.findAll({
                where: { link_with_opportunity: req.query.link_with_opportunity },
                include: [
                    { model: req.config.taskStatus, paranoid: false, },
                    { model: req.config.taskPriority, paranoid: false, },
                    {
                        model: req.config.users, as: "createdByUser", attributes: {
                            exclude: ['password']
                        }, paranoid: false,
                    },
                    {
                        model: req.config.users, as: "assignedToUser", attributes: {
                            exclude: ['password']
                        }, paranoid: false
                    },
                    { model: req.config.opportunities, as: "linkWithOpportunity", paranoid: false, },
                    { model: req.config.leads, paranoid: false },
                ], order: [
                    ['task_id', 'DESC']
                ]
            })
        }
        else {
            tasks = await req.config.tasks.findAll({
                where: whereClause,
                include: [
                    { model: req.config.taskStatus, paranoid: false, },
                    { model: req.config.taskPriority, paranoid: false, },
                    {
                        model: req.config.users, as: "createdByUser", attributes: {
                            exclude: ['password']
                        }, paranoid: false,
                    },
                    {
                        model: req.config.users, as: "assignedToUser", attributes: {
                            exclude: ['password']
                        }, paranoid: false
                    },
                    { model: req.config.opportunities, as: "linkWithOpportunity", paranoid: false, },
                    { model: req.config.leads, paranoid: false },
                ], order: [
                    ['task_id', 'DESC']
                ]
            })
        }
        await responseSuccess(req, res, "task list", tasks)

    } catch (error) {
        logErrorToFile(error)
        console.log(error)
        return await responseError(req, res, "Something Went Wrong")
    }
}


exports.editTask = async (req, res) => {
    const process = await req.config.sequelize.transaction();
    try {

        let taskBody = req.body
        let tasksData = await req.config.tasks.findOne({
            where: {
                task_id: taskBody.task_id,
            }
        }, { transaction: process })

        if (!tasksData) {
            await process.cleanup();
            return await responseError(req, res, "no task exist")
        }

        let tasksCheckData = await req.config.tasks.findOne({
            where: {
                task_name: taskBody.task_name,
                task_id: { [Op.ne]: taskBody.task_id, }
            }
        }, { transaction: process })

        if (tasksCheckData) {
            await process.cleanup()
            return await responseError(req, res, "task data exist")
        }

        await req.config.tasks.update(taskBody, {
            where: {
                task_id: taskBody.task_id,
            },
            transaction: process
        })
        await process.commit();
        return await responseSuccess(req, res, "task status updated")

    } catch (error) {
        logErrorToFile(error)
        console.log(error)
        await process.rollback();
        return await responseError(req, res, "Something Went Wrong")
    }
}


exports.deleteTask = async (req, res) => {
    try {

        let { t_id } = req.query
        let tasksData = await req.config.tasks.findOne({
            where: {
                task_id: t_id,
            }
        })

        if (!tasksData) return await responseError(req, res, "task does not existed")
        await tasksData.destroy()
        return await responseSuccess(req, res, "task deleted")

    } catch (error) {
        logErrorToFile(error)
        console.log(error)
        return await responseError(req, res, "Something Went Wrong")
    }
}



/*  --------------------------------- task priority ---------------------------------------- */
