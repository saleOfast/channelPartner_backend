const { Sequelize, DataTypes, QueryTypes, where, Op } = require("sequelize");
const { responseError, responseSuccess } = require("../../helper/responce");

exports.addPaymentStatus = async (req, res) => {
    try {
        const { p_s_name } = req.body
        if (!p_s_name || p_s_name == "") {
            return await responseError(req, res, "Please Enter Payment Status")
        }
        let check = await req.config.paymentStatus.findOne(
            { where: { p_s_name: p_s_name } },
            { paranoid: false })
        if (check) {
            return await responseError(req, res, "Payment Status Already Exists")
        }
        let count = await req.config.paymentStatus.count({ paranoid: false })
        let data = await req.config.paymentStatus.create({
            p_s_code: `PS_${(count + 1).toString().padStart(7, '0')}`,
            p_s_name: p_s_name,
            status: true
        })
        return await responseSuccess(req, res, "Payment Status Created Succesfully", data)

    } catch (error) {
        logErrorToFile(error)
        console.log(error)
        return await responseError(req, res, "Something Went Wrong")
    }
}

exports.getPaymentStatus = async (req, res) => {
    try {
        let data
        const { p_s_id } = req.body

        if (p_s_id && p_s_id != null && p_s_id != "") {
            data = await req.config.paymentStatus.findOne({ where: { p_s_id: p_s_id } })
        } else {
            data = await req.config.paymentStatus.findAll()
        }
        return await responseSuccess(req, res, "Payment Status Fetched Succesfully", data)

    } catch (error) {
        logErrorToFile(error)
        console.log(error)
        return await responseError(req, res, "Something Went Wrong")
    }
}

exports.updatePaymentStatus = async (req, res) => {
    try {
        let data
        const { p_s_id, p_s_name, status } = req.body

        data = await req.config.paymentStatus.findOne({ where: { p_s_id: p_s_id } })
        if (!data) {
            return await responseError(req, res, "The Payment Status ID does not exist or disabled")
        }
        if (status == true || status == false) {
            await data.update({ status: status })
            return await responseSuccess(req, res, status ? "Payment Status Enabled Succesfully" : "Payment Status Disabled Succesfully")
        } else {
            let check = await req.config.paymentStatus.findOne(
                {
                    where: {
                        p_s_name: p_s_name,
                        p_s_id: { [Op.ne]: p_s_id }
                    }
                },
                {
                    paranoid: false
                })
            if (check) {
                return await responseError(req, res, "The Payment Status ID already exist")
            }
            await data.update({ p_s_name: p_s_name })
            return await responseSuccess(req, res, "Payment Status Updated Succesfully")
        }

    } catch (error) {
        logErrorToFile(error)
        console.log(error)
        return await responseError(req, res, "Something Went Wrong")
    }
}

exports.deletePaymentStatus = async (req, res) => {
    try {
        let data
        const { p_s_id } = req.query

        data = await req.config.paymentStatus.findOne({ where: { p_s_id: p_s_id } })
        if (!data) {
            return await responseError(req, res, "The Payment Status ID does not exist or disabled")
        }
        await data.destroy()
        return await responseSuccess(req, res, "Payment Status Deleted Succesfully")

    } catch (error) {
        logErrorToFile(error)
        console.log(error)
        return await responseError(req, res, "Something Went Wrong")
    }
}

