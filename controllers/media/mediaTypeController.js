const { Sequelize, DataTypes, QueryTypes, where, Op } = require("sequelize");
const { responseError, responseSuccess } = require("../../helper/responce");

exports.addMediaType = async (req, res) => {
    try {
        const { m_t_name } = req.body
        if (!m_t_name || m_t_name == "") {
            return await responseError(req, res, "Please Enter Media Type")
        }
        let check = await req.config.mediaType.findOne(
            { where: { m_t_name: m_t_name } },
            { paranoid: false })
        if (check) {
            return await responseError(req, res, "Media Type Already Exists")
        }
        let count = await req.config.mediaType.count({ paranoid: false })
        let data = await req.config.mediaType.create({
            m_t_code: `M_T_00${count + 1}`,
            m_t_name: m_t_name,
            status: true
        })
        return await responseSuccess(req, res, "Media Type Created Succesfully", data)

    } catch (error) {
        logErrorToFile(error)
        console.log(error)
        return await responseError(req, res, "Something Went Wrong")
    }
}

exports.getMediaType = async (req, res) => {
    try {
        let data
        const { m_t_id } = req.body

        if (m_t_id && m_t_id != null && m_t_id != "") {
            data = await req.config.mediaType.findOne({ where: { m_t_id: m_t_id } })
        } else {
            data = await req.config.mediaType.findAll()
        }
        return await responseSuccess(req, res, "Media Type Fetched Succesfully", data)

    } catch (error) {
        logErrorToFile(error)
        console.log(error)
        return await responseError(req, res, "Something Went Wrong")
    }
}

exports.updateMediaType = async (req, res) => {
    try {
        let data
        const { m_t_id, m_t_name, status } = req.body

        data = await req.config.mediaType.findOne({ where: { m_t_id: m_t_id } })
        if (!data) {
            return await responseError(req, res, "The Media ID does not exist or disabled")
        }
        if (status == true || status == false) {
            await data.update({ status: status })
            return await responseSuccess(req, res, status ? "Media Type Enabled Succesfully" : "Media Type Disabled Succesfully")
        } else {
            let check = await req.config.mediaType.findOne(
                {
                    where: {
                        m_t_name: m_t_name,
                        m_t_id: { [Op.ne]: m_t_id }
                    }
                },
                {
                    paranoid: false
                })
            if (check) {
                return await responseError(req, res, "The Media Type ID already exist")
            }
            await data.update({ m_t_name: m_t_name })
            return await responseSuccess(req, res, "Media Type Updated Succesfully")
        }

    } catch (error) {
        logErrorToFile(error)
        console.log(error)
        return await responseError(req, res, "Something Went Wrong")
    }
}

exports.deleteMediaType = async (req, res) => {
    try {
        let data
        const { m_t_id } = req.query

        data = await req.config.mediaType.findOne({ where: { m_t_id: m_t_id } })
        if (!data) {
            return await responseError(req, res, "The Media Type ID does not exist or disabled")
        }
        await data.destroy()
        return await responseSuccess(req, res, "Media Type Deleted Succesfully")

    } catch (error) {
        logErrorToFile(error)
        console.log(error)
        return await responseError(req, res, "Something Went Wrong")
    }
}

