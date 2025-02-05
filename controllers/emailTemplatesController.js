const { Sequelize, DataTypes, QueryTypes, where, Op } = require("sequelize");
const { responseError, responseSuccess } = require("../helper/responce");

exports.getEmailTemplates = async (req, res) => {
    try {
        let data
        const { template_id, platform_id } = req.query

        if (template_id && template_id != null && template_id != "") {
            data = await req.config.emailTemplates.findOne({ where: { template_id: template_id }, })
        }
        else if (platform_id && platform_id != null && platform_id != "") {
            data = await req.config.emailTemplates.findAll({ where: { platform_id: platform_id }, })
        }
        else {
            data = await req.config.emailTemplates.findAll({ order: [['template_id', 'DESC']] })
        }
        return await responseSuccess(req, res, "Email Template Fetched Succesfully", data)

    } catch (error) {
        logErrorToFile(error)
        console.log(error)
        return await responseError(req, res, "Something Went Wrong")
    }
}

exports.updateEmailTemplates = async (req, res) => {
    try {
        let data
        const { template_id, template } = req.body

        data = await req.config.emailTemplates.findOne({ where: { template_id: template_id } })

        if (!data) {
            return await responseError(req, res, "The Email Template ID does not exist")
        }
        if (!template || template == "" || template == "null") {
            return await responseError(req, res, "Please provide a valid template")
        }
        await data.update({ template: template })
        return await responseSuccess(req, res, "Email Template Updated Succesfully")

    } catch (error) {
        logErrorToFile(error)
        console.log(error)
        return await responseError(req, res, "Something Went Wrong")
    }
}


