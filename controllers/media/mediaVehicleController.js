const { Sequelize, DataTypes, QueryTypes, where, Op } = require("sequelize");
const { responseError, responseSuccess } = require("../../helper/responce");

exports.addMediaVehicle = async (req, res) => {
    try {
        const { m_v_name, m_f_id } = req.body
        if (!m_v_name || m_v_name == "") {
            return await responseError(req, res, "Please Enter Media Vehicle")
        }
        let check = await req.config.mediaVehicle.findOne(
            { where: { m_v_name: m_v_name } },
            { paranoid: false })
        if (check) {
            return await responseError(req, res, "Media Vehicle Already Exists")
        }
        let count = await req.config.mediaVehicle.count({ paranoid: false })
        let data = await req.config.mediaVehicle.create({
            m_v_code: `M_V_00${count + 1}`,
            m_v_name: m_v_name,
            m_f_id: m_f_id,
            status: true
        })
        return await responseSuccess(req, res, "Media Vehicle Created Succesfully", data)

    } catch (error) {
        logErrorToFile(error)
        console.log(error)
        return await responseError(req, res, "Something Went Wrong")
    }
}

exports.getMediaVehicle = async (req, res) => {
    try {
        let data
        const { m_v_id, m_f_id } = req.body

        if (m_v_id && m_v_id != null && m_v_id != "" && m_v_id != undefined) {
            data = await req.config.mediaVehicle.findOne({ where: { m_v_id: m_v_id } })
        }
        else if (m_f_id && m_f_id != null && m_f_id != "" && m_f_id != undefined) {
            data = await req.config.mediaVehicle.findOne({ where: { m_f_id: m_f_id } })
        }
        else {
            data = await req.config.mediaVehicle.findAll()
        }
        return await responseSuccess(req, res, "Media Vehicle Fetched Succesfully", data)

    } catch (error) {
        logErrorToFile(error)
        console.log(error)
        return await responseError(req, res, "Something Went Wrong")
    }
}

exports.updateMediaVehicle = async (req, res) => {
    try {
        let data
        const { m_v_id, m_v_name, m_f_id, status } = req.body

        data = await req.config.mediaVehicle.findOne({ where: { m_v_id: m_v_id } })
        if (!data) {
            return await responseError(req, res, "The Media Vehcile ID does not exist or disabled")
        }
        if (status == true || status == false) {
            await data.update({ status: status })
        } else {
            let check = await req.config.mediaVehicle.findOne(
                {
                    where: {
                        m_v_name: m_v_name,
                        m_v_id: { [Op.ne]: m_v_id }
                    }
                },
                {
                    paranoid: false
                })
            if (check) {
                return await responseError(req, res, "The Media Vehicle ID already exist")
            }
            await data.update({ m_v_name: m_v_name, m_f_id: m_f_id })
            return await responseSuccess(req, res, "Media Vehicle Updated Succesfully")
        }

    } catch (error) {
        logErrorToFile(error)
        console.log(error)
        return await responseError(req, res, "Something Went Wrong")
    }
}

exports.deleteMediaVehicle = async (req, res) => {
    try {
        let data
        const { m_v_id } = req.query

        data = await req.config.mediaVehicle.findOne({ where: { m_v_id: m_v_id } })
        if (!data) {
            return await responseError(req, res, "The Site ID does not exist or disabled")
        }
        await data.destroy()
        return await responseSuccess(req, res, "Media Vehicle Deleted Succesfully")

    } catch (error) {
        logErrorToFile(error)
        console.log(error)
        return await responseError(req, res, "Something Went Wrong")
    }
}

