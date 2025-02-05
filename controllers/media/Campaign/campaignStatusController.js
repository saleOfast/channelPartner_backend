const { Sequelize, DataTypes, QueryTypes, where, Op } = require("sequelize");
const { responseError, responseSuccess } = require("../../../helper/responce");

exports.addCampaignStatus = async (req, res) => {
    try {
        const { cmpn_s_name } = req.body
        if (!cmpn_s_name || cmpn_s_name == "") {
            return await responseError(req, res, "Please Enter Campaign Status")
        }
        let check = await req.config.campaignStatus.findOne(
            { where: { cmpn_s_name: cmpn_s_name } },
            { paranoid: false })
        if (check) {
            return await responseError(req, res, "Campaign Status Already Exists")
        }
        let count = await req.config.campaignStatus.count({ paranoid: false })
        let data = await req.config.campaignStatus.create({
            cmpn_s_code: `CMPN_S_00${count}`,
            cmpn_s_name: cmpn_s_name,
            status: true
        })
        return await responseSuccess(req, res, "Campaign Status Created Succesfully", data)

    } catch (error) {
        logErrorToFile(error)
        console.log(error)
        return await responseError(req, res, "Something Went Wrong")
    }
}

exports.getCampaignStatus = async (req, res) => {
    try {
        let data
        const { cmpn_s_id } = req.body

        if (cmpn_s_id && cmpn_s_id != null && cmpn_s_id != "") {
            data = await req.config.campaignStatus.findOne({ where: { cmpn_s_id: cmpn_s_id } })
        } else {
            data = await req.config.campaignStatus.findAll()
        }
        return await responseSuccess(req, res, "Campaign Status Fetched Succesfully", data)

    } catch (error) {
        logErrorToFile(error)
        console.log(error)
        return await responseError(req, res, "Something Went Wrong")
    }
}

exports.updateCampaignStatus = async (req, res) => {
    try {
        let data
        const { cmpn_s_id, cmpn_s_name, status } = req.body

        data = await req.config.campaignStatus.findOne({ where: { cmpn_s_id: cmpn_s_id } })
        if (!data) {
            return await responseError(req, res, "The Campaign Status ID does not exist or disabled")
        }
        if (status == true || status == false) {
            await data.update({ status: status })
            return await responseSuccess(req, res, status ? "Campaign Status Enabled Succesfully" : "Campaign Status Disabled Succesfully")
        } else {
            let check = await req.config.campaignStatus.findOne(
                {
                    where: {
                        cmpn_s_name: cmpn_s_name,
                        cmpn_s_id: { [Op.ne]: cmpn_s_id }
                    }
                },
                {
                    paranoid: false
                })
            if (check) {
                return await responseError(req, res, "The Campaign Status ID already exist")
            }
            await data.update({ cmpn_s_name: cmpn_s_name })
            return await responseSuccess(req, res, "Campaign Status Updated Succesfully")
        }

    } catch (error) {
        logErrorToFile(error)
        console.log(error)
        return await responseError(req, res, "Something Went Wrong")
    }
}

exports.deleteCampaignStatus = async (req, res) => {
    try {
        let data
        const { cmpn_s_id } = req.query

        data = await req.config.campaignStatus.findOne({ where: { cmpn_s_id: cmpn_s_id } })
        if (!data) {
            return await responseError(req, res, "The Campaign Status ID does not exist or disabled")
        }
        await data.destroy()
        return await responseSuccess(req, res, "Campaign Status Deleted Succesfully")

    } catch (error) {
        logErrorToFile(error)
        console.log(error)
        return await responseError(req, res, "Something Went Wrong")
    }
}

