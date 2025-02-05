const { Sequelize, DataTypes, QueryTypes, where, Op } = require("sequelize");
const { responseError, responseSuccess } = require("../../helper/responce");

exports.addMountingCost = async (req, res) => {
    try {
        const { mo_c_cost, acc_id, acc_name, m_t_id } = req.body
        if (!mo_c_cost || mo_c_cost == "") {
            return await responseError(req, res, "Please Enter Mounting Cost")
        }

        let check = await req.config.mountingCost.findOne(
            { where: { mo_c_cost: mo_c_cost, acc_id: acc_id } },
            { paranoid: false })

        if (check) {
            return await responseError(req, res, "Mounting Cost Already Exists")
        }

        let count = await req.config.mountingCost.count({ paranoid: false })

        let data = await req.config.mountingCost.create({
            mo_c_cost: mo_c_cost,
            mo_c_code: `MC_00${count + 1}`,
            acc_id: acc_id,
            acc_name: acc_name,
            m_t_id: m_t_id,
            status: 'ACTIVE'
        })

        return await responseSuccess(req, res, "Mounting Cost Created Succesfully", data)

    } catch (error) {
        logErrorToFile(error)
        console.log(error)
        return await responseError(req, res, "Something Went Wrong")
    }
}

exports.getMountingCost = async (req, res) => {
    try {
        let data
        const { mo_c_id } = req.query

        if (mo_c_id && mo_c_id != null && mo_c_id != "") {
            data = await req.config.mountingCost.findOne(
                {
                    where: { mo_c_id: mo_c_id },
                    include: [
                        {
                            model: req.config.accounts, paranoid: false,
                            include: [
                                { model: req.config.states, as: "billState", paranoid: false, },
                                { model: req.config.city, as: "billCity", paranoid: false, },
                            ],
                        },
                        { model: req.config.mediaType, paranoid: false },
                    ],
                    order: [
                        ['mo_c_id', 'DESC']
                    ]
                })
        } else {
            data = await req.config.mountingCost.findAll(
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
                    ],
                    order: [
                        ['mo_c_id', 'DESC']
                    ]
                }
            )
        }
        return await responseSuccess(req, res, "Mounting Cost Fetched Succesfully", data)

    } catch (error) {
        logErrorToFile(error)
        console.log(error)
        return await responseError(req, res, "Something Went Wrong")
    }
}

exports.updateMountingCost = async (req, res) => {
    try {
        let data
        const { mo_c_id, mo_c_cost, acc_id, acc_name, status, m_t_id } = req.body

        data = await req.config.mountingCost.findOne({ where: { mo_c_id: mo_c_id } })
        if (!data) {
            return await responseError(req, res, "The Media ID does not exist or disabled")
        }
        if (status == 'ACTIVE' || status == 'INACTIVE') {
            await data.update({ status: status })
            return await responseSuccess(req, res, status == 'ACTIVE' ? "Mounting Cost Enabled Succesfully" : "Mounting Cost Disabled Succesfully")
        } else {
            let check = await req.config.mountingCost.findOne(
                {
                    where: {
                        mo_c_cost: mo_c_cost,
                        acc_id: acc_id,
                        mo_c_id: { [Op.ne]: mo_c_id }
                    }
                },
                {
                    paranoid: false
                })
            if (check) {
                return await responseError(req, res, "The Mounting Cost ID already exist")
            }
            await data.update({ mo_c_cost: mo_c_cost, m_t_id: m_t_id, acc_id: acc_id, acc_name: acc_name })
            return await responseSuccess(req, res, "Mounting Cost Updated Succesfully")
        }

    } catch (error) {
        logErrorToFile(error)
        console.log(error)
        return await responseError(req, res, "Something Went Wrong")
    }
}

exports.deleteMountingCost = async (req, res) => {
    try {
        let data
        const { mo_c_id } = req.query

        data = await req.config.mountingCost.findOne({ where: { mo_c_id: mo_c_id } })
        if (!data) {
            return await responseError(req, res, "The Mounting Cost ID does not exist or disabled")
        }
        await data.destroy()
        return await responseSuccess(req, res, "Mounting Cost Deleted Succesfully")

    } catch (error) {
        logErrorToFile(error)
        console.log(error)
        return await responseError(req, res, "Something Went Wrong")
    }
}

