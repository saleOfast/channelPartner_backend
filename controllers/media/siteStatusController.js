const { Sequelize, DataTypes, QueryTypes, where, Op } = require("sequelize");
const { responseError, responseSuccess } = require("../../helper/responce");

exports.addSiteStatus = async (req, res) => {
    try {
        const { s_s_name } = req.body
        if (!s_s_name || s_s_name == "") {
            return await responseError(req, res, "Please Enter Site Status")
        }
        let check = await req.config.siteStatus.findOne(
            { where: { s_s_name: s_s_name } },
            { paranoid: false })
        if (check) {
            return await responseError(req, res, "Site Status Already Exists")
        }
        let count = await req.config.siteStatus.count({ paranoid: false })
        let data = await req.config.siteStatus.create({
            s_s_code: `S_S_00${count + 1}`,
            s_s_name: s_s_name,
            status: true
        })
        return await responseSuccess(req, res, "Site Status Created Succesfully", data)

    } catch (error) {
        logErrorToFile(error)
        console.log(error)
        return await responseError(req, res, "Something Went Wrong")
    }
}

exports.getSiteStatus = async (req, res) => {
    try {
        let data
        const { s_s_id } = req.body

        if (s_s_id && s_s_id != null && s_s_id != "") {
            data = await req.config.siteStatus.findOne({ where: { s_s_id: s_s_id } })
        } else {
            data = await req.config.siteStatus.findAll()
        }
        return await responseSuccess(req, res, "Site Status Fetched Succesfully", data)

    } catch (error) {
        logErrorToFile(error)
        console.log(error)
        return await responseError(req, res, "Something Went Wrong")
    }
}

exports.updateSiteStatus = async (req, res) => {
    try {
        let data
        const { s_s_id, s_s_name, status } = req.body

        data = await req.config.siteStatus.findOne({ where: { s_s_id: s_s_id } })
        if (!data) {
            return await responseError(req, res, "The Media ID does not exist or disabled")
        }
        if (status == true || status == false) {
            await data.update({ status: status })
            return await responseSuccess(req, res, status ? "Site Status Enabled Succesfully" : "Site Status Disabled Succesfully")
        } else {
            let check = await req.config.siteStatus.findOne(
                {
                    where: {
                        s_s_name: s_s_name,
                        s_s_id: { [Op.ne]: s_s_id }
                    }
                },
                {
                    paranoid: false
                })
            if (check) {
                return await responseError(req, res, "The Site Status ID already exist")
            }
            await data.update({ s_s_name: s_s_name })
            return await responseSuccess(req, res, "Site Status Updated Succesfully")
        }

    } catch (error) {
        logErrorToFile(error)
        console.log(error)
        return await responseError(req, res, "Something Went Wrong")
    }
}

exports.deleteSiteStatus = async (req, res) => {
    try {
        let data
        const { s_s_id } = req.query

        data = await req.config.siteStatus.findOne({ where: { s_s_id: s_s_id } })
        if (!data) {
            return await responseError(req, res, "The Site Status ID does not exist or disabled")
        }
        await data.destroy()
        return await responseSuccess(req, res, "Site Status Deleted Succesfully")

    } catch (error) {
        logErrorToFile(error)
        console.log(error)
        return await responseError(req, res, "Something Went Wrong")
    }
}

