const { Sequelize, DataTypes, QueryTypes, where, Op } = require("sequelize");
const { responseError, responseSuccess } = require("../../../helper/responce");

exports.addCampaignBusinessType = async (req, res) => {
    try {
        const { cmpn_b_t_name } = req.body
        if (!cmpn_b_t_name || cmpn_b_t_name == "") {
            return await responseError(req, res, "Please Enter Campaign Business Type")
        }
        let check = await req.config.campaignBusinessType.findOne(
            { where: { cmpn_b_t_name: cmpn_b_t_name } },
            { paranoid: false })
        if (check) {
            return await responseError(req, res, "Campaign Business Type Already Exists")
        }
        let count = await req.config.campaignBusinessType.count({ paranoid: false })
        let data = await req.config.campaignBusinessType.create({
            cmpn_b_t_code: `CMPN_B_T_00${count}`,
            cmpn_b_t_name: cmpn_b_t_name,
            status: true
        })
        return await responseSuccess(req, res, "Campaign Business Type Created Succesfully", data)

    } catch (error) {
        logErrorToFile(error)
        console.log(error)
        return await responseError(req, res, "Something Went Wrong")
    }
}

exports.getCampaignBusinessType = async (req, res) => {
    try {
        let data
        const { cmpn_b_t_id } = req.body

        if (cmpn_b_t_id && cmpn_b_t_id != null && cmpn_b_t_id != "") {
            data = await req.config.campaignBusinessType.findOne({ where: { cmpn_b_t_id: cmpn_b_t_id } })
        } else {
            data = await req.config.campaignBusinessType.findAll()
        }
        return await responseSuccess(req, res, "Campaign Business Type Fetched Succesfully", data)

    } catch (error) {
        logErrorToFile(error)
        console.log(error)
        return await responseError(req, res, "Something Went Wrong")
    }
}

exports.updateCampaignBusinessType = async (req, res) => {
    try {
        let data
        const { cmpn_b_t_id, cmpn_b_t_name, status } = req.body

        data = await req.config.campaignBusinessType.findOne({ where: { cmpn_b_t_id: cmpn_b_t_id } })
        if (!data) {
            return await responseError(req, res, "The Campaign Business Type ID does not exist or disabled")
        }
        if (status == true || status == false) {
            await data.update({ status: status })
            return await responseSuccess(req, res, status ? "Campaign Business Type Enabled Succesfully" : "Campaign Business Type Disabled Succesfully")
        } else {
            let check = await req.config.campaignBusinessType.findOne(
                {
                    where: {
                        cmpn_b_t_name: cmpn_b_t_name,
                        cmpn_b_t_id: { [Op.ne]: cmpn_b_t_id }
                    }
                },
                {
                    paranoid: false
                })
            if (check) {
                return await responseError(req, res, "The Campaign Business Type ID already exist")
            }
            await data.update({ cmpn_b_t_name: cmpn_b_t_name })
            return await responseSuccess(req, res, "Campaign Business Type Updated Succesfully")
        }

    } catch (error) {
        logErrorToFile(error)
        console.log(error)
        return await responseError(req, res, "Something Went Wrong")
    }
}

exports.deleteCampaignBusinessType = async (req, res) => {
    try {
        let data
        const { cmpn_b_t_id } = req.query

        data = await req.config.campaignBusinessType.findOne({ where: { cmpn_b_t_id: cmpn_b_t_id } })
        if (!data) {
            return await responseError(req, res, "The Campaign Business Type ID does not exist or disabled")
        }
        await data.destroy()
        return await responseSuccess(req, res, "Campaign Business Type Deleted Succesfully")

    } catch (error) {
        logErrorToFile(error)
        console.log(error)
        return await responseError(req, res, "Something Went Wrong")
    }
}

