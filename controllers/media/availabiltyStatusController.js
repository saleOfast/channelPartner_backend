const { Sequelize, DataTypes, QueryTypes, where, Op } = require("sequelize");
const { responseError, responseSuccess } = require("../../helper/responce");

exports.addAvailabiltyStatus = async (req, res) => {
    try {
        const { a_s_name } = req.body
        if (!a_s_name || a_s_name == "") {
            return await responseError(req, res, "Please Enter Availabilty Status")
        }
        let check = await req.config.availabiltyStatus.findOne(
            { where: { a_s_name: a_s_name } },
            { paranoid: false })
        if (check) {
            return await responseError(req, res, "Availabilty Status Already Exists")
        }
        let count = await req.config.availabiltyStatus.count({ paranoid: false })
        let data = await req.config.availabiltyStatus.create({
            a_s_code: `A_S_00${count + 1}`,
            a_s_name: a_s_name,
            status: true
        })
        return await responseSuccess(req, res, "Availabilty Status Created Succesfully", data)

    } catch (error) {
        logErrorToFile(error)
        console.log(error)
        return await responseError(req, res, "Something Went Wrong")
    }
}

exports.getAvailabiltyStatus = async (req, res) => {
    try {
        let data
        const { a_s_id } = req.body

        if (a_s_id && a_s_id != null && a_s_id != "") {
            data = await req.config.availabiltyStatus.findOne({ where: { a_s_id: a_s_id } })
        } else {
            data = await req.config.availabiltyStatus.findAll()
        }
        return await responseSuccess(req, res, "Availabilty Status Fetched Succesfully", data)

    } catch (error) {
        logErrorToFile(error)
        console.log(error)
        return await responseError(req, res, "Something Went Wrong")
    }
}

exports.updateAvailabiltyStatus = async (req, res) => {
    try {
        let data
        const { a_s_id, a_s_name, status } = req.body

        data = await req.config.availabiltyStatus.findOne({ where: { a_s_id: a_s_id } })
        if (!data) {
            return await responseError(req, res, "The Media ID does not exist or disabled")
        }
        if (status == true || status == false) {
            await data.update({ status: status })
            return await responseSuccess(req, res, status ? "Availabilty Status Enabled Succesfully" : "Availabilty Status Disabled Succesfully")
        } else {
            let check = await req.config.availabiltyStatus.findOne(
                {
                    where: {
                        a_s_name: a_s_name,
                        a_s_id: { [Op.ne]: a_s_id }
                    }
                },
                {
                    paranoid: false
                })
            if (check) {
                return await responseError(req, res, "The Availabilty Status ID already exist")
            }
            await data.update({ a_s_name: a_s_name })
            return await responseSuccess(req, res, "Availabilty Status Updated Succesfully")
        }

    } catch (error) {
        logErrorToFile(error)
        console.log(error)
        return await responseError(req, res, "Something Went Wrong")
    }
}

exports.deleteAvailabiltyStatus = async (req, res) => {
    try {
        let data
        const { a_s_id } = req.query

        data = await req.config.availabiltyStatus.findOne({ where: { a_s_id: a_s_id } })
        if (!data) {
            return await responseError(req, res, "The Availabilty Status ID does not exist or disabled")
        }
        await data.destroy()
        return await responseSuccess(req, res, "Availabilty Status Deleted Succesfully")

    } catch (error) {
        logErrorToFile(error)
        console.log(error)
        return await responseError(req, res, "Something Went Wrong")
    }
}

