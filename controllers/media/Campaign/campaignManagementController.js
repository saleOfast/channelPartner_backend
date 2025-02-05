const { Sequelize, DataTypes, QueryTypes, where, Op } = require("sequelize");
const { responseError, responseSuccess, getEstimateCode } = require("../../../helper/responce");
const fileUpload = require("../../../common/imageExport");

exports.addCampaign = async (req, res) => {
    try {
        let body = req.body
        console.log(req.body)
        body.campaign_code = await getEstimateCode(req, 'campaign')
        let proof_attachment = "";

        if (req.files && req.files.proof_attachment) {
            proof_attachment = await fileUpload.imageExport(req, res, "supportDoc", "proof_attachment");
            body.proof_attachment = proof_attachment;
        }
        // if (body.s_o_po_date.toLowerCase() == 'invalid date') {
        //     delete body.s_o_po_date
        // }
        await req.config.mediaCampaignManagement.create(body)
        return await responseSuccess(req, res, "Campaign Added Succesfully")

    } catch (error) {
        logErrorToFile(error)
        console.log(error)
        return await responseError(req, res, "Something Went Wrong")
    }
}

exports.getCampaign = async (req, res) => {
    try {
        const { campaign_id } = req.query;
        let query = {
            attributes: {
            },
            include: [
                { model: req.config.accounts, paranoid: false },
                { model: req.config.campaignStatus, paranoid: false },
                { model: req.config.campaignProof, paranoid: false },
                { model: req.config.campaignBusinessType, paranoid: false },
            ],
            order: [
                ['campaign_id', 'DESC']
            ]
        };

        if (campaign_id) {
            query.where = { campaign_id: campaign_id };
            data = await req.config.mediaCampaignManagement.findOne(query);
        } else {
            data = await req.config.mediaCampaignManagement.findAll(query);
        }

        return await responseSuccess(req, res, "Campaign Management Fetched Successfully", data);
    } catch (error) {
        logErrorToFile(error);
        console.log(error);
        return await responseError(req, res, "Something Went Wrong");
    }
};

exports.updateCampaign = async (req, res) => {
    try {
        const { campaign_id } = req.body
        let data = req.body
        let proof_attachment = "";

        if (req.files && req.files.proof_attachment) {
            proof_attachment = await fileUpload.imageExport(req, res, "supportDoc", "proof_attachment");
            body.proof_attachment = proof_attachment;
        }

        let body = await req.config.mediaCampaignManagement.findOne({ where: { campaign_id: campaign_id } })

        if (!body) {
            return await responseError(req, res, "The Campaign does not exist.")
        }

        await body.update(data)
        return await responseSuccess(req, res, "Campaign Updated Succesfully")

    } catch (error) {
        logErrorToFile(error)
        console.log(error)
        return await responseError(req, res, "Something Went Wrong")
    }
}

exports.deleteCampaign = async (req, res) => {
    try {
        let { campaign_id } = req.query

        let data = await req.config.mediaCampaignManagement.findOne({ where: { campaign_id: campaign_id } })

        if (!data) {
            return await responseError(req, res, "The Campaign does not exist.")
        }
        await data.destroy()
        return await responseSuccess(req, res, "Campaign Deleted Succesfully")

    } catch (error) {
        logErrorToFile(error)
        console.log(error)
        return await responseError(req, res, "Something Went Wrong")
    }
}

exports.uploadPOPdf = async (req, res) => {
    try {
        const { campaign_id } = req.body

        if (req.files && req.files.pdf) {
            req.body.sales_order_pdf = await fileUpload.imageExport(req, res, "supportDoc", "pdf");
        }

        const estimation = await req.config.estimations.findOne({ where: { campaign_id: campaign_id } })

        const data = await req.config.mediaCampaignManagement.findOne({ where: { campaign_id: campaign_id } })

        if (!data) {
            return await responseError(req, res, "The Campaign does not exist.")
        }

        req.body.last_modified_by = req.user.user_code
        if (req.body.campaign_id) {
            delete req.body.campaign_id
        }
        await estimation.update(req.body)
        await data.update(req.body)
        return await responseSuccess(req, res, "Purchase Order Uploaded Succesfully")

    } catch (error) {
        logErrorToFile(error)
        console.log(error)
        return await responseError(req, res, "Something Went Wrong")
    }
}