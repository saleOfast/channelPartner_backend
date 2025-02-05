const { Sequelize, DataTypes, QueryTypes, where, Op } = require("sequelize");
const { responseError, responseSuccess } = require("../../helper/responce");

exports.addNDPReason = async (req, res) => {
    try {
        const { ndp_r_name } = req.body
        if (!ndp_r_name || ndp_r_name == "") {
            return await responseError(req, res, "Please Enter NDP Reason")
        }
        let check = await req.config.NDPReason.findOne(
            { where: { ndp_r_name: ndp_r_name } },
            { paranoid: false })
        if (check) {
            return await responseError(req, res, "NDP Reason Already Exists")
        }
        let count = await req.config.NDPReason.count({ paranoid: false })
        let data = await req.config.NDPReason.create({
            rating_code: `NDP_R_${(count + 1).toString().padStart(7, '0')}`,
            ndp_r_name: ndp_r_name,
            status: true
        })
        return await responseSuccess(req, res, "NDP Reason Created Succesfully", data)

    } catch (error) {
        logErrorToFile(error)
        console.log(error)
        return await responseError(req, res, "Something Went Wrong")
    }
}

exports.getNDPReason = async (req, res) => {
    try {
        let data
        const { ndp_r_id } = req.body

        if (ndp_r_id && ndp_r_id != null && ndp_r_id != "") {
            data = await req.config.NDPReason.findOne({ where: { ndp_r_id: ndp_r_id } })
        } else {
            data = await req.config.NDPReason.findAll()
        }
        return await responseSuccess(req, res, "NDPReason Fetched Succesfully", data)

    } catch (error) {
        logErrorToFile(error)
        console.log(error)
        return await responseError(req, res, "Something Went Wrong")
    }
}

exports.updateNDPReason = async (req, res) => {
    try {
        let data
        const { ndp_r_id, ndp_r_name, status } = req.body

        data = await req.config.NDPReason.findOne({ where: { ndp_r_id: ndp_r_id } })
        if (!data) {
            return await responseError(req, res, "The NDPReason ID does not exist or disabled")
        }
        if (status == true || status == false) {
            await data.update({ status: status })
            return await responseSuccess(req, res, status ? "NDPReason Enabled Succesfully" : "NDPReason Disabled Succesfully")
        } else {
            let check = await req.config.NDPReason.findOne(
                {
                    where: {
                        ndp_r_name: ndp_r_name,
                        ndp_r_id: { [Op.ne]: ndp_r_id }
                    }
                },
                {
                    paranoid: false
                })
            if (check) {
                return await responseError(req, res, "The NDPReason ID already exist")
            }
            await data.update({ ndp_r_name: ndp_r_name })
            return await responseSuccess(req, res, "NDPReason Updated Succesfully")
        }

    } catch (error) {
        logErrorToFile(error)
        console.log(error)
        return await responseError(req, res, "Something Went Wrong")
    }
}

exports.deleteNDPReason = async (req, res) => {
    try {
        let data
        const { ndp_r_id } = req.query

        data = await req.config.NDPReason.findOne({ where: { ndp_r_id: ndp_r_id } })
        if (!data) {
            return await responseError(req, res, "The NDPReason ID does not exist or disabled")
        }
        await data.destroy()
        return await responseSuccess(req, res, "NDPReason Deleted Succesfully")

    } catch (error) {
        logErrorToFile(error)
        console.log(error)
        return await responseError(req, res, "Something Went Wrong")
    }
}

