const { Sequelize, DataTypes, QueryTypes, where, Op } = require("sequelize");
const { responseError, responseSuccess } = require("../../../helper/responce");

exports.addCampaignProof = async (req, res) => {
    try {
        const { cmpn_p_name } = req.body
        if (!cmpn_p_name || cmpn_p_name == "") {
            return await responseError(req, res, "Please Enter Campaign Proof")
        }
        let check = await req.config.campaignProof.findOne(
            { where: { cmpn_p_name: cmpn_p_name } },
            { paranoid: false })
        if (check) {
            return await responseError(req, res, "Campaign Proof Already Exists")
        }
        let count = await req.config.campaignProof.count({ paranoid: false })
        let data = await req.config.campaignProof.create({
            cmpn_p_code: `CMPN_P_00${count}`,
            cmpn_p_name: cmpn_p_name,
            status: true
        })
        return await responseSuccess(req, res, "Campaign Proof Created Succesfully", data)

    } catch (error) {
        logErrorToFile(error)
        console.log(error)
        return await responseError(req, res, "Something Went Wrong")
    }
}

exports.getCampaignProof = async (req, res) => {
    try {
        let data
        const { cmpn_p_id } = req.body

        if (cmpn_p_id && cmpn_p_id != null && cmpn_p_id != "") {
            data = await req.config.campaignProof.findOne({ where: { cmpn_p_id: cmpn_p_id } })
        } else {
            data = await req.config.campaignProof.findAll()
        }
        return await responseSuccess(req, res, "Campaign Proof Fetched Succesfully", data)

    } catch (error) {
        logErrorToFile(error)
        console.log(error)
        return await responseError(req, res, "Something Went Wrong")
    }
}

exports.updateCampaignProof = async (req, res) => {
    try {
        let data
        const { cmpn_p_id, cmpn_p_name, status } = req.body

        data = await req.config.campaignProof.findOne({ where: { cmpn_p_id: cmpn_p_id } })
        if (!data) {
            return await responseError(req, res, "The Campaign Proof ID does not exist or disabled")
        }
        if (status == true || status == false) {
            await data.update({ status: status })
            return await responseSuccess(req, res, status ? "Campaign Proof Enabled Succesfully" : "Campaign Proof Disabled Succesfully")
        } else {
            let check = await req.config.campaignProof.findOne(
                {
                    where: {
                        cmpn_p_name: cmpn_p_name,
                        cmpn_p_id: { [Op.ne]: cmpn_p_id }
                    }
                },
                {
                    paranoid: false
                })
            if (check) {
                return await responseError(req, res, "The Campaign Proof ID already exist")
            }
            await data.update({ cmpn_p_name: cmpn_p_name })
            return await responseSuccess(req, res, "Campaign Proof Updated Succesfully")
        }

    } catch (error) {
        logErrorToFile(error)
        console.log(error)
        return await responseError(req, res, "Something Went Wrong")
    }
}

exports.deleteCampaignProof = async (req, res) => {
    try {
        let data
        const { cmpn_p_id } = req.query

        data = await req.config.campaignProof.findOne({ where: { cmpn_p_id: cmpn_p_id } })
        if (!data) {
            return await responseError(req, res, "The Campaign Proof ID does not exist or disabled")
        }
        await data.destroy()
        return await responseSuccess(req, res, "Campaign Proof Deleted Succesfully")

    } catch (error) {
        logErrorToFile(error)
        console.log(error)
        return await responseError(req, res, "Something Went Wrong")
    }
}

