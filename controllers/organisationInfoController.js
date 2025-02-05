const { Sequelize, DataTypes, QueryTypes, where, Op } = require("sequelize");
const { responseError, responseSuccess } = require("../helper/responce");

exports.addOrganisation = async (req, res) => {
    try {
        let body = req.body
        const { company_name, mobile, email, website, country_id, state_id, city_id, address } = req.body

        let check = await req.config.organisationInfo.findAll()

        if (check.length > 0) {
            return await responseError(req, res, "Organisation Info Has Already Been Created")
        }

        if (!company_name || !mobile || !email || !website || !country_id || !state_id || !city_id || !address) {
            return await responseError(req, res, "All Fields Are Mandatory")
        }

        let data = await req.config.organisationInfo.create(body)

        return await responseSuccess(req, res, "Organisation Info Created Succesfully", data)

    } catch (error) {
        logErrorToFile(error)
        console.log(error)
        return await responseError(req, res, "Something Went Wrong")
    }
}

exports.getOrganisation = async (req, res) => {
    try {
        let data
        const { organisation_info_id } = req.body

        if (organisation_info_id && organisation_info_id != null && organisation_info_id != "") {
            data = await req.config.organisationInfo.findOne(
                {
                    where: { organisation_info_id: organisation_info_id },
                    include: [
                        { model: req.config.country, paranoid: false },
                        { model: req.config.states, paranoid: false },
                        { model: req.config.city, paranoid: false },
                    ]
                })
        } else {
            data = await req.config.organisationInfo.findAll({
                include: [
                    { model: req.config.country, paranoid: false },
                    { model: req.config.states, paranoid: false },
                    { model: req.config.city, paranoid: false },
                ]
            })
        }
        return await responseSuccess(req, res, "Organisation Info Fetched Succesfully", data)

    } catch (error) {
        logErrorToFile(error)
        console.log(error)
        return await responseError(req, res, "Something Went Wrong")
    }
}

exports.updateOrganisation = async (req, res) => {
    try {
        let data
        const { organisation_info_id } = req.body

        data = await req.config.organisationInfo.findOne({ where: { organisation_info_id: organisation_info_id } })
        if (!data) {
            return await responseError(req, res, "The Organisation Info ID does not exist or disabled")
        }

        await data.update(req.body)
        return await responseSuccess(req, res, "Organisation Info Updated Succesfully")


    } catch (error) {
        logErrorToFile(error)
        console.log(error)
        return await responseError(req, res, "Something Went Wrong")
    }
}

exports.deleteOrganisation = async (req, res) => {
    try {
        let data
        const { organisation_info_id } = req.query

        data = await req.config.organisationInfo.findOne({ where: { organisation_info_id: organisation_info_id } })
        if (!data) {
            return await responseError(req, res, "The Organisation Info ID does not exist or disabled")
        }
        await data.destroy()
        return await responseSuccess(req, res, "Organisation Info Deleted Succesfully")

    } catch (error) {
        logErrorToFile(error)
        console.log(error)
        return await responseError(req, res, "Something Went Wrong")
    }
}

