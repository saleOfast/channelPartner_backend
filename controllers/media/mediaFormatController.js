const { Sequelize, DataTypes, QueryTypes, where, Op } = require("sequelize");
const { responseError, responseSuccess } = require("../../helper/responce");

exports.addMediaFormat = async (req, res) => {
    try {
        const { m_f_name } = req.body
        if (!m_f_name || m_f_name == "") {
            return await responseError(req, res, "Please Enter Media Format")
        }
        let check = await req.config.mediaFormat.findOne(
            { where: { m_f_name: m_f_name } },
            { paranoid: false })
        if (check) {
            return await responseError(req, res, "Media Format Already Exists")
        }
        let count = await req.config.mediaFormat.count({ paranoid: false })
        let data = await req.config.mediaFormat.create({
            m_f_code: `M_F_00${count + 1}`,
            m_f_name: m_f_name,
            status: true
        })
        return await responseSuccess(req, res, "Media Format Created Succesfully", data)

    } catch (error) {
        logErrorToFile(error)
        console.log(error)
        return await responseError(req, res, "Something Went Wrong")
    }
}

exports.getMediaFormat = async (req, res) => {
    try {
        let data
        const { m_f_id } = req.body

        if (m_f_id && m_f_id != null && m_f_id != "") {
            data = await req.config.mediaFormat.findOne({ where: { m_f_id: m_f_id } })
        } else {
            data = await req.config.mediaFormat.findAll()
        }
        return await responseSuccess(req, res, "Media Format Fetched Succesfully", data)

    } catch (error) {
        logErrorToFile(error)
        console.log(error)
        return await responseError(req, res, "Something Went Wrong")
    }
}

exports.updateMediaFormat = async (req, res) => {
    try {
        let data
        const { m_f_id, m_f_name, status } = req.body

        data = await req.config.mediaFormat.findOne({ where: { m_f_id: m_f_id } })
        if (!data) {
            return await responseError(req, res, "The Media ID does not exist or disabled")
        }
        if (status == true || status == false) {
            await data.update({ status: status })
            return await responseSuccess(req, res, status ? "Media Format Enabled Succesfully" : "Media Format Disabled Succesfully")
        } else {
            let check = await req.config.mediaFormat.findOne(
                {
                    where: {
                        m_f_name: m_f_name,
                        m_f_id: { [Op.ne]: m_f_id }
                    }
                },
                {
                    paranoid: false
                })
            if (check) {
                return await responseError(req, res, "The Media Format ID already exist")
            }
            await data.update({ m_f_name: m_f_name })
            return await responseSuccess(req, res, "Media Format Updated Succesfully")
        }

    } catch (error) {
        logErrorToFile(error)
        console.log(error)
        return await responseError(req, res, "Something Went Wrong")
    }
}

exports.deleteMediaFormat = async (req, res) => {
    try {
        let data
        const { m_f_id } = req.query

        data = await req.config.mediaFormat.findOne({ where: { m_f_id: m_f_id } })
        if (!data) {
            return await responseError(req, res, "The Media Format ID does not exist or disabled")
        }
        await data.destroy()
        return await responseSuccess(req, res, "Media Format Deleted Succesfully")

    } catch (error) {
        logErrorToFile(error)
        console.log(error)
        return await responseError(req, res, "Something Went Wrong")
    }
}

