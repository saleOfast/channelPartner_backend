const { Sequelize, DataTypes, QueryTypes, where, Op } = require("sequelize");
const { responseError, responseSuccess } = require("../../helper/responce");

exports.addEstimateStatus = async (req, res) => {
    try {
        const { est_s_name } = req.body
        if (!est_s_name || est_s_name == "") {
            return await responseError(req, res, "Please Enter Estimate Status")
        }
        let check = await req.config.estimateStatus.findOne(
            { where: { est_s_name: est_s_name } },
            { paranoid: false })
        if (check) {
            return await responseError(req, res, "Estimate Status Already Exists")
        }
        let count = await req.config.estimateStatus.count({ paranoid: false })
        let data = await req.config.estimateStatus.create({
            est_s_code: `EST_S_00${count}`,
            est_s_name: est_s_name,
            status: true
        })
        return await responseSuccess(req, res, "Estimate Status Created Succesfully", data)

    } catch (error) {
        logErrorToFile(error)
        console.log(error)
        return await responseError(req, res, "Something Went Wrong")
    }
}

exports.getEstimateStatus = async (req, res) => {
    try {
        let data
        const { est_s_id } = req.body

        if (est_s_id && est_s_id != null && est_s_id != "") {
            data = await req.config.estimateStatus.findOne({ where: { est_s_id: est_s_id } })
        } else {
            data = await req.config.estimateStatus.findAll()
        }
        return await responseSuccess(req, res, "Estimate Status Fetched Succesfully", data)

    } catch (error) {
        logErrorToFile(error)
        console.log(error)
        return await responseError(req, res, "Something Went Wrong")
    }
}

exports.updateEstimateStatus = async (req, res) => {
    try {
        let data
        const { est_s_id, est_s_name, status } = req.body

        data = await req.config.estimateStatus.findOne({ where: { est_s_id: est_s_id } })
        if (!data) {
            return await responseError(req, res, "The Estimate Status ID does not exist or disabled")
        }
        if (status == true || status == false) {
            await data.update({ status: status })
            return await responseSuccess(req, res, status ? "Estimate Status Enabled Succesfully" : "Estimate Status Disabled Succesfully")
        } else {
            let check = await req.config.estimateStatus.findOne(
                {
                    where: {
                        est_s_name: est_s_name,
                        est_s_id: { [Op.ne]: est_s_id }
                    }
                },
                {
                    paranoid: false
                })
            if (check) {
                return await responseError(req, res, "The Estimate Status ID already exist")
            }
            await data.update({ est_s_name: est_s_name })
            return await responseSuccess(req, res, "Estimate Status Updated Succesfully")
        }

    } catch (error) {
        logErrorToFile(error)
        console.log(error)
        return await responseError(req, res, "Something Went Wrong")
    }
}

exports.deleteEstimateStatus = async (req, res) => {
    try {
        let data
        const { est_s_id } = req.query

        data = await req.config.estimateStatus.findOne({ where: { est_s_id: est_s_id } })
        if (!data) {
            return await responseError(req, res, "The Estimate Status ID does not exist or disabled")
        }
        await data.destroy()
        return await responseSuccess(req, res, "Estimate Status Deleted Succesfully")

    } catch (error) {
        logErrorToFile(error)
        console.log(error)
        return await responseError(req, res, "Something Went Wrong")
    }
}

