const { Sequelize, DataTypes, QueryTypes, where, Op } = require("sequelize");
const { responseError, responseSuccess } = require("../../helper/responce");

exports.addEstimationType = async (req, res) => {
    try {
        const { est_t_name } = req.body
        if (!est_t_name || est_t_name == "") {
            return await responseError(req, res, "Please Enter Estimation Type")
        }
        let check = await req.config.estimationType.findOne(
            { where: { est_t_name: est_t_name } },
            { paranoid: false })
        if (check) {
            return await responseError(req, res, "Estimation Type Already Exists")
        }
        let count = await req.config.estimationType.count({ paranoid: false })
        let data = await req.config.estimationType.create({
            est_t_code: `EST_T${(count + 1).toString().padStart(7, '0')}`,
            est_t_name: est_t_name,
            status: true
        })
        return await responseSuccess(req, res, "Estimation Type Created Succesfully", data)

    } catch (error) {
        logErrorToFile(error)
        console.log(error)
        return await responseError(req, res, "Something Went Wrong")
    }
}

exports.getEstimationType = async (req, res) => {
    try {
        let data
        const { est_t_id } = req.body

        if (est_t_id && est_t_id != null && est_t_id != "") {
            data = await req.config.estimationType.findOne({ where: { est_t_id: est_t_id } })
        } else {
            data = await req.config.estimationType.findAll()
        }
        return await responseSuccess(req, res, "Estimation Type Fetched Succesfully", data)

    } catch (error) {
        logErrorToFile(error)
        console.log(error)
        return await responseError(req, res, "Something Went Wrong")
    }
}

exports.updateEstimationType = async (req, res) => {
    try {
        let data
        const { est_t_id, est_t_name, status } = req.body

        data = await req.config.estimationType.findOne({ where: { est_t_id: est_t_id } })
        if (!data) {
            return await responseError(req, res, "The Estimation Type ID does not exist or disabled")
        }
        if (status == true || status == false) {
            await data.update({ status: status })
            return await responseSuccess(req, res, status ? "Estimation Type Enabled Succesfully" : "Estimation Type Disabled Succesfully")
        } else {
            let check = await req.config.estimationType.findOne(
                {
                    where: {
                        est_t_name: est_t_name,
                        est_t_id: { [Op.ne]: est_t_id }
                    }
                },
                {
                    paranoid: false
                })
            if (check) {
                return await responseError(req, res, "The Estimation Type ID already exist")
            }
            await data.update({ est_t_name: est_t_name })
            return await responseSuccess(req, res, "Estimation Type Updated Succesfully")
        }

    } catch (error) {
        logErrorToFile(error)
        console.log(error)
        return await responseError(req, res, "Something Went Wrong")
    }
}

exports.deleteEstimationType = async (req, res) => {
    try {
        let data
        const { est_t_id } = req.query

        data = await req.config.estimationType.findOne({ where: { est_t_id: est_t_id } })
        if (!data) {
            return await responseError(req, res, "The Estimation Type ID does not exist or disabled")
        }
        await data.destroy()
        return await responseSuccess(req, res, "Estimation Type Deleted Succesfully")

    } catch (error) {
        logErrorToFile(error)
        console.log(error)
        return await responseError(req, res, "Something Went Wrong")
    }
}

