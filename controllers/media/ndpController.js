const { Sequelize, DataTypes, QueryTypes, where, Op } = require("sequelize");
const { responseError, responseSuccess } = require("../../helper/responce");

exports.addNDP = async (req, res) => {
    try {
        let body = req.body
        let count = await req.config.ndp.count({ paranoid: false })

        body.ndp_code = `NDP_${(count + 1).toString().padStart(7, '0')}`
        let data = await req.config.ndp.create(body)
        return await responseSuccess(req, res, "NDP Created Succesfully", data)

    } catch (error) {
        logErrorToFile(error)
        console.log(error)
        return await responseError(req, res, "Something Went Wrong")
    }
}

exports.getNDP = async (req, res) => {
    try {
        let data
        const { ndp_id, estimate_id, campaign_id, site_id } = req.body

        if (ndp_id && ndp_id != null && ndp_id != "") {
            data = await req.config.ndp.findOne({ where: { ndp_id: ndp_id } })
        }
        if (estimate_id && estimate_id != null && estimate_id != "") {
            data = await req.config.ndp.findAll({ where: { estimate_id: estimate_id } })
        }
        if (campaign_id && campaign_id != null && campaign_id != "") {
            data = await req.config.ndp.findAll({ where: { campaign_id: campaign_id } })
        }
        if (site_id && site_id != null && site_id != "") {
            data = await req.config.ndp.findAll({ where: { site_id: site_id } })
        }
        else {
            data = await req.config.ndp.findAll()
        }
        return await responseSuccess(req, res, "NDP Fetched Succesfully", data)

    } catch (error) {
        logErrorToFile(error)
        console.log(error)
        return await responseError(req, res, "Something Went Wrong")
    }
}

exports.updateNDP = async (req, res) => {
    try {
        let data
        const { ndp_id, status } = req.body

        data = await req.config.ndp.findOne({ where: { ndp_id: ndp_id } })
        if (!data) {
            return await responseError(req, res, "The NDP ID does not exist or disabled")
        }
        if (status == true || status == false) {
            await data.update({ status: status })
            return await responseSuccess(req, res, status ? "NDP Enabled Succesfully" : "NDP Disabled Succesfully")
        } else {
            await data.update(req.body)
            return await responseSuccess(req, res, "NDP Updated Succesfully")
        }

    } catch (error) {
        logErrorToFile(error)
        console.log(error)
        return await responseError(req, res, "Something Went Wrong")
    }
}

exports.deleteNDP = async (req, res) => {
    try {
        let data
        const { ndp_id } = req.query

        data = await req.config.ndp.findOne({ where: { ndp_id: ndp_id } })
        if (!data) {
            return await responseError(req, res, "The NDP ID does not exist or disabled")
        }
        await data.destroy()
        return await responseSuccess(req, res, "NDP Deleted Succesfully")

    } catch (error) {
        logErrorToFile(error)
        console.log(error)
        return await responseError(req, res, "Something Went Wrong")
    }
}

exports.approveNDP = async (req, res) => {
    try {
        let data
        const { ndp_id, action } = req.body

        data = await req.config.ndp.findOne({ where: { ndp_id: ndp_id } })
        if (!data) {
            return await responseError(req, res, "The NDP ID does not exist or disabled")
        }
        await data.update({ cd_approval: action, cd_response: true })
        return await responseSuccess(req, res, action ? "NDP Approved successfully." : "NDP Rejected successfully.")

    } catch (error) {
        logErrorToFile(error)
        console.log(error)
        return await responseError(req, res, "Something Went Wrong")
    }
}
