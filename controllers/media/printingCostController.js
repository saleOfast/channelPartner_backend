const { Sequelize, DataTypes, QueryTypes, where, Op } = require("sequelize");
const { responseError, responseSuccess } = require("../../helper/responce");

exports.addPrintingCost = async (req, res) => {
    try {
        const { pr_c_cost, acc_id, acc_name, m_t_id, pr_m_id } = req.body
        if (!pr_c_cost || pr_c_cost == "") {
            return await responseError(req, res, "Please Enter Printing Cost")
        }

        let check = await req.config.printingCost.findOne(
            { where: { pr_c_cost: pr_c_cost, acc_id: acc_id } },
            { paranoid: false })

        if (check) {
            return await responseError(req, res, "Printing Cost Already Exists")
        }

        let count = await req.config.printingCost.count({ paranoid: false })

        let data = await req.config.printingCost.create({
            pr_c_cost: pr_c_cost,
            pr_c_code: `PC_00${count + 1}`,
            acc_id: acc_id,
            acc_name: acc_name,
            m_t_id: m_t_id,
            pr_m_id: pr_m_id,
            status: 'ACTIVE'
        })

        return await responseSuccess(req, res, "Printing Cost Created Succesfully", data)

    } catch (error) {
        logErrorToFile(error)
        console.log(error)
        return await responseError(req, res, "Something Went Wrong")
    }
}

exports.getPrintingCost = async (req, res) => {
    try {
        let data
        const { pr_c_id } = req.query

        if (pr_c_id && pr_c_id != null && pr_c_id != "") {
            data = await req.config.printingCost.findOne(
                {
                    where: {
                        pr_c_id: pr_c_id
                    },
                    include: [
                        {
                            model: req.config.accounts, paranoid: false,
                            include: [
                                { model: req.config.states, as: "billState", paranoid: false, },
                                { model: req.config.city, as: "billCity", paranoid: false, },
                            ],
                        },
                        { model: req.config.mediaType, paranoid: false },
                        { model: req.config.printingMaterial, paranoid: false },
                    ],
                    order: [
                        ['pr_c_id', 'DESC']
                    ]
                })
        } else {
            data = await req.config.printingCost.findAll(
                {
                    include: [
                        {
                            model: req.config.accounts, paranoid: false,
                            include: [
                                { model: req.config.states, as: "billState", paranoid: false, },
                                { model: req.config.city, as: "billCity", paranoid: false, },
                            ],
                        },
                        { model: req.config.mediaType, paranoid: false },
                        { model: req.config.printingMaterial, paranoid: false },
                    ],
                    order: [
                        ['pr_c_id', 'DESC']
                    ]
                }
            )
        }
        return await responseSuccess(req, res, "Printing Cost Fetched Succesfully", data)

    } catch (error) {
        logErrorToFile(error)
        console.log(error)
        return await responseError(req, res, "Something Went Wrong")
    }
}

exports.updatePrintingCost = async (req, res) => {
    try {
        let data
        const { pr_c_id, pr_c_cost, acc_id, acc_name, status, m_t_id, pr_m_id } = req.body

        data = await req.config.printingCost.findOne({ where: { pr_c_id: pr_c_id } })
        if (!data) {
            return await responseError(req, res, "The Media ID does not exist or disabled")
        }
        if (status == 'ACTIVE' || status == 'INACTIVE') {
            await data.update({ status: status })
            return await responseSuccess(req, res, status == 'ACTIVE' ? "Printing Cost Enabled Succesfully" : "Printing Cost Disabled Succesfully")
        } else {
            let check = await req.config.printingCost.findOne(
                {
                    where: {
                        pr_c_cost: pr_c_cost,
                        acc_id: acc_id,
                        pr_c_id: { [Op.ne]: pr_c_id }
                    }
                },
                {
                    paranoid: false
                })
            if (check) {
                return await responseError(req, res, "The Printing Cost ID already exist")
            }
            await data.update({ pr_c_cost: pr_c_cost, m_t_id: m_t_id, acc_id: acc_id, acc_name: acc_name, pr_m_id: pr_m_id })
            return await responseSuccess(req, res, "Printing Cost Updated Succesfully")
        }

    } catch (error) {
        logErrorToFile(error)
        console.log(error)
        return await responseError(req, res, "Something Went Wrong")
    }
}

exports.deletePrintingCost = async (req, res) => {
    try {
        let data
        const { pr_c_id } = req.query

        data = await req.config.printingCost.findOne({ where: { pr_c_id: pr_c_id } })
        if (!data) {
            return await responseError(req, res, "The Printing Cost ID does not exist or disabled")
        }
        await data.destroy()
        return await responseSuccess(req, res, "Printing Cost Deleted Succesfully")

    } catch (error) {
        logErrorToFile(error)
        console.log(error)
        return await responseError(req, res, "Something Went Wrong")
    }
}

