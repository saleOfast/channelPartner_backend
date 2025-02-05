const { Sequelize, DataTypes, QueryTypes, where, Op } = require("sequelize");
const { responseError, responseSuccess } = require("../../helper/responce");

exports.addPrintingMaterial = async (req, res) => {
    try {
        const { pr_m_name } = req.body
        if (!pr_m_name || pr_m_name == "") {
            return await responseError(req, res, "Please Enter Printing Material")
        }
        let check = await req.config.printingMaterial.findOne(
            { where: { pr_m_name: pr_m_name } },
            { paranoid: false })
        if (check) {
            return await responseError(req, res, "Printing Material Already Exists")
        }
        let count = await req.config.printingMaterial.count({ paranoid: false })
        let data = await req.config.printingMaterial.create({
            pr_m_code: `PR_M_00${count + 1}`,
            pr_m_name: pr_m_name,
            status: 'ACTIVE'
        })
        return await responseSuccess(req, res, "Printing Material Created Succesfully", data)

    } catch (error) {
        logErrorToFile(error)
        console.log(error)
        return await responseError(req, res, "Something Went Wrong")
    }
}

exports.getPrintingMaterial = async (req, res) => {
    try {
        let data
        const { pr_m_id } = req.body

        if (pr_m_id && pr_m_id != null && pr_m_id != "") {
            data = await req.config.printingMaterial.findOne({ where: { pr_m_id: pr_m_id } })
        } else {
            data = await req.config.printingMaterial.findAll()
        }
        return await responseSuccess(req, res, "Printing Material Fetched Succesfully", data)

    } catch (error) {
        logErrorToFile(error)
        console.log(error)
        return await responseError(req, res, "Something Went Wrong")
    }
}

exports.updatePrintingMaterial = async (req, res) => {
    try {
        let data
        const { pr_m_id, pr_m_name, status } = req.body

        data = await req.config.printingMaterial.findOne({ where: { pr_m_id: pr_m_id } })
        if (!data) {
            return await responseError(req, res, "The Printing Material ID does not exist or disabled")
        }
        if (status == 'ACTIVE' || status == 'INACTIVE') {
            await data.update({ status: status })
            return await responseSuccess(req, res, status ? "Printing Material Enabled Succesfully" : "Printing Material Disabled Succesfully")
        } else {
            let check = await req.config.printingMaterial.findOne(
                {
                    where: {
                        pr_m_name: pr_m_name,
                        pr_m_id: { [Op.ne]: pr_m_id }
                    }
                },
                {
                    paranoid: false
                })
            if (check) {
                return await responseError(req, res, "The Printing Material ID already exist")
            }
            await data.update({ pr_m_name: pr_m_name })
            return await responseSuccess(req, res, "Printing Material Updated Succesfully")
        }

    } catch (error) {
        logErrorToFile(error)
        console.log(error)
        return await responseError(req, res, "Something Went Wrong")
    }
}

exports.deletePrintingMaterial = async (req, res) => {
    try {
        let data
        const { pr_m_id } = req.query

        data = await req.config.printingMaterial.findOne({ where: { pr_m_id: pr_m_id } })
        if (!data) {
            return await responseError(req, res, "The Printing Material ID does not exist or disabled")
        }
        await data.destroy()
        return await responseSuccess(req, res, "Printing Material Deleted Succesfully")

    } catch (error) {
        logErrorToFile(error)
        console.log(error)
        return await responseError(req, res, "Something Went Wrong")
    }
}

