const { Sequelize, DataTypes, QueryTypes, where, Op } = require("sequelize");
const { responseError, responseSuccess } = require("../../helper/responce");

exports.addSalesOrder = async (req, res) => {
    try {
        const { estimate_id, campaign_id, acc_id } = req.body

        const [account, estimate, campaign, count, check] = await Promise.all([
            req.config.accounts.findOne({ where: { acc_id: acc_id } }),
            req.config.estimations.findOne({ where: { estimate_id: estimate_id } }),
            req.config.mediaCampaignManagement.findOne({ where: { campaign_id: campaign_id } }),
            req.config.salesOrder.count(),
            req.config.salesOrder.findOne({ where: { acc_id: acc_id, estimate_id: estimate_id, campaign_id: campaign_id } }),
        ]);
        if (!account) {
            return await responseError(req, res, "Vendor account not found.")
        }
        if (!estimate) {
            return await responseError(req, res, "Estimate not found.")
        }
        if (!campaign) {
            return await responseError(req, res, "Campaign not found.")
        }
        if (check) {
            return await responseError(req, res, "Sales order already exist")
        }

        req.body.s_o_code = `SO${(count + 1).toString().padStart(6, '0')}`;

        const data = await req.config.salesOrder.create(req.body)
        return await responseSuccess(req, res, "Sales Order Created Succesfully", data)

    } catch (error) {
        logErrorToFile(error)
        console.log(error)
        return await responseError(req, res, "Something Went Wrong")
    }
}

exports.getSalesOrder = async (req, res) => {
    try {
        let data
        const { s_o_id, estimate_id, campaign_id } = req.query

        if (s_o_id && s_o_id != null && s_o_id != "") {
            data = await req.config.salesOrder.findOne({
                where: { s_o_id: s_o_id },
                include: [
                    { model: req.config.accounts, paranoid: false },
                    { model: req.config.estimations, paranoid: false },
                    { model: req.config.mediaCampaignManagement, paranoid: false },
                ]
            })
        }
        else if (estimate_id && estimate_id != null && estimate_id != "") {
            data = await req.config.salesOrder.findOne({
                where: { estimate_id: estimate_id },
                include: [
                    { model: req.config.accounts, paranoid: false },
                    { model: req.config.estimations, paranoid: false },
                    { model: req.config.mediaCampaignManagement, paranoid: false },
                ]
            })
        }
        else if (campaign_id && campaign_id != null && campaign_id != "") {
            data = await req.config.salesOrder.findAll({
                where: { campaign_id: campaign_id },
                include: [
                    { model: req.config.accounts, paranoid: false },
                    { model: req.config.estimations, paranoid: false },
                    { model: req.config.mediaCampaignManagement, paranoid: false },
                ]
            })
        }
        else {
            data = await req.config.salesOrder.findAll({
                include: [
                    { model: req.config.accounts, paranoid: false },
                    { model: req.config.estimations, paranoid: false },
                    { model: req.config.mediaCampaignManagement, paranoid: false },
                ]
            })
        }
        return await responseSuccess(req, res, "Sales Order Fetched Succesfully", data)

    } catch (error) {
        logErrorToFile(error)
        console.log(error)
        return await responseError(req, res, "Something Went Wrong")
    }
}

exports.updateSalesOrder = async (req, res) => {
    try {
        let data
        const { s_o_id, status } = req.body

        data = await req.config.salesOrder.findOne({ where: { s_o_id: s_o_id } })
        if (!data) {
            return await responseError(req, res, "The Sales Order ID does not exist or disabled")
        }
        if (status == true || status == false) {
            await data.update({ status: status })
            return await responseSuccess(req, res, status ? "Sales Order Enabled Succesfully" : "Sales Order Disabled Succesfully")
        } else {
            await data.update(req.body)
            return await responseSuccess(req, res, "Sales Order Updated Succesfully")
        }

    } catch (error) {
        logErrorToFile(error)
        console.log(error)
        return await responseError(req, res, "Something Went Wrong")
    }
}

exports.deleteSalesOrder = async (req, res) => {
    try {
        let data
        const { s_o_id } = req.query

        data = await req.config.salesOrder.findOne({ where: { s_o_id: s_o_id } })
        if (!data) {
            return await responseError(req, res, "The Sales Order ID does not exist or disabled")
        }
        await data.destroy()
        return await responseSuccess(req, res, "Sales Order Deleted Succesfully")

    } catch (error) {
        logErrorToFile(error)
        console.log(error)
        return await responseError(req, res, "Something Went Wrong")
    }
}

