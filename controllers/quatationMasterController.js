const { Sequelize, DataTypes, QueryTypes, where, Op } = require("sequelize");
const { responseError, responseSuccess } = require('../helper/responce')
const fs = require('fs');
const path = require('path');
const xlsx = require('xlsx');

exports.storeQuatMaster = async (req, res) => {
    try {
        let { quatProductBody, quatTaxBody } = req.body
        let quatMasterData;
        let count = await req.config.quatMasters.count({ paranoid: false })
        req.body.quat_code = `Q_00${count}`
        quatMasterData = await req.config.quatMasters.create(req.body)

        await Promise.all(quatProductBody?.map(async (item, i) => {
            item.quat_mast_id = quatMasterData.quat_mast_id
            await req.config.quatProducts.create(item)
            return item
        }))

        await Promise.all(quatTaxBody?.map(async (item, i) => {
            item.quat_mast_id = quatMasterData.quat_mast_id
            await req.config.quatTaxes.create(item)
            return item
        }))

        return await responseSuccess(req, res, "quatation created Succesfully", quatMasterData)

    } catch (error) {
        logErrorToFile(error)
        console.log(error)
        return await responseError(req, res, "Something Went Wrong")
    }
}

const dateChange = (date) => {
    const dueDate = new Date(date);
    const formattedDueDate = dueDate.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' });
    return formattedDueDate
}

exports.downloadExcelData = async (req, res) => {
    try {

        whereClause = {};
        let commonExclude = ["createdAt", "updatedAt", "deletedAt"];
        if (!req.user.isDB) {
            whereClause = {
                [Op.or]: [
                    { quat_owner: req.user.user_id },
                    { assigned_to: req.user.user_id }
                ]
            }
        }

        let quatMasterData = await req.config.quatMasters.findAll({
            where: whereClause,
            include: [
                {
                    model: req.config.opportunities, as: "quatOpportunity", attributes: {
                        exclude: commonExclude
                    },

                    include: [
                        {
                            model: req.config.accounts, as: "accName", attributes: {
                                exclude: ["createdAt", "updatedAt", "deletedAt"]
                            }, paranoid: false
                        },
                    ],

                    paranoid: false,
                },

                { model: req.config.users, as: "quatOwner", attributes: ["user_id", "user"], paranoid: false, },

                { model: req.config.users, as: "assignedQuat", attributes: ["user_id", "user"], paranoid: false, },

                {
                    model: req.config.quatStatuses, as: "quatStatus", attributes: {
                        exclude: commonExclude
                    }, paranoid: false,
                },

                {
                    model: req.config.country, as: "quatCountry", attributes: {
                        exclude: commonExclude
                    }, paranoid: false,
                },
                {
                    model: req.config.states, as: "quatState", attributes: {
                        exclude: commonExclude
                    }, paranoid: false,
                },

                {
                    model: req.config.city, as: "quatCity", attributes: {
                        exclude: commonExclude
                    }, paranoid: false,
                },
                {
                    model: req.config.country, as: "quatShipCountry", attributes: {
                        exclude: commonExclude
                    }, paranoid: false,
                },
                {
                    model: req.config.states, as: "quatShipState", attributes: {
                        exclude: commonExclude
                    }, paranoid: false,
                },

                {
                    model: req.config.city, as: "quatShipCity", attributes: {
                        exclude: commonExclude
                    }, paranoid: false,
                },
            ]
        })
        //console.log("lead", lead[0].dataValues?.db_department.dataValues?.department)
        // console.log('lead', lead);
        let excelClientData = []
        quatMasterData?.forEach(element => {
            let item = {
                "Quatation_code": element?.dataValues?.quat_code,
                "Status": element.dataValues?.quatStatus?.dataValues?.quat_status_name,
                "Owner": element?.dataValues?.quatOwner?.dataValues?.user,
                "Assigned To": element?.dataValues?.assignedQuat?.dataValues?.user,
                "Mobile no": element?.dataValues?.contact_no,
                "Email": element?.dataValues?.email,
                "Oportunity": element?.dataValues?.quatOpportunity?.dataValues?.opp_name,
                "Summary": element?.dataValues?.quat_summery,
                "Product Sub Total": element?.dataValues?.sub_total,
                "Grand Total": element?.dataValues?.grand_total,
                "Genrated Date": dateChange(element?.dataValues?.genrated_date),
                "Valid Till Date": dateChange(element?.dataValues?.valid_till),
                "Billing Country": element?.dataValues?.quatCountry?.dataValues?.country_name,
                "Billing State": element?.dataValues?.quatState.dataValues?.state_name,
                "Billing City": element?.dataValues?.quatCity.dataValues?.city_name,
                "Billing Pincode": element?.dataValues?.bill_pincode,
                "Billing Address": element?.dataValues?.bill_address,
                "Shipping Country": element?.dataValues?.quatShipCountry?.dataValues?.country_name,
                "Shipping State": element?.dataValues?.quatShipState?.dataValues?.state_name,
                "Shipping City": element?.dataValues?.quatShipCity?.dataValues?.city_name,
                "Shipping Pincode": element.dataValues?.ship_pincode,
                "Shipping Address": element.dataValues?.ship_address,
            }
            excelClientData.push(item)
        });
        // let excelClientData = lead?.map((item)=> item.dataValues?)
        const workbook = xlsx.utils.book_new();
        const worksheet = xlsx.utils.json_to_sheet(excelClientData);
        // Add the worksheet to the workbook
        xlsx.utils.book_append_sheet(workbook, worksheet, 'Sheet1');

        // Generate a temporary file path to save the Excel workbook
        const tempFilePath = path.join(__dirname, `../uploads/temp`, 'temp.xlsx');

        // Write the workbook to a file
        xlsx.writeFile(workbook, tempFilePath);

        // Set the response headers
        res.setHeader('Content-Type', 'application/vnd.ms-excel');
        res.setHeader('Content-Disposition', 'attachment; filename=example.xlsx');

        // Stream the file to the response
        const stream = fs.createReadStream(tempFilePath);
        stream.pipe(res);

        // Delete the temporary file after sending the response
        stream.on('end', () => {
            fs.unlinkSync(tempFilePath);
        });

        return
    } catch (error) {
        logErrorToFile(error)
        console.log(error)
        return res.status(400).json({ status: 400, message: "Something Went Wrong" })
    }
}

exports.getQuatMaster = async (req, res) => {
    try {

        let quatation;
        req.user.isDB
        whereClause = {};
        let commonExclude = ["createdAt", "updatedAt", "deletedAt"];
        if (!req.user.isDB) {
            whereClause = {
                [Op.or]: [
                    { quat_owner: req.user.user_id },
                    { assigned_to: req.user.user_id }
                ]
            }
        }


        if (req.query.qm_id) {
            let quatMasterData = await req.config.quatMasters.findAll({
                where: {
                    quat_mast_id: req.query.qm_id
                },
                include: [
                    {
                        model: req.config.opportunities, as: "quatOpportunity", attributes: {
                            exclude: commonExclude
                        },
                        include: [
                            {
                                model: req.config.accounts, as: "accName", attributes: {
                                    exclude: ["createdAt", "updatedAt", "deletedAt"]
                                }, paranoid: false
                            },
                        ],

                        paranoid: false,
                    },

                    { model: req.config.users, as: "quatOwner", attributes: ["user_id", "user"], paranoid: false, },

                    { model: req.config.users, as: "assignedQuat", attributes: ["user_id", "user"], paranoid: false, },

                    {
                        model: req.config.quatStatuses, as: "quatStatus", attributes: {
                            exclude: commonExclude
                        }, paranoid: false,
                    },

                    {
                        model: req.config.country, as: "quatCountry", attributes: {
                            exclude: commonExclude
                        }, paranoid: false,
                    },
                    {
                        model: req.config.states, as: "quatState", attributes: {
                            exclude: commonExclude
                        }, paranoid: false,
                    },

                    {
                        model: req.config.city, as: "quatCity", attributes: {
                            exclude: commonExclude
                        }, paranoid: false,
                    },
                    {
                        model: req.config.country, as: "quatShipCountry", attributes: {
                            exclude: commonExclude
                        }, paranoid: false,
                    },
                    {
                        model: req.config.states, as: "quatShipState", attributes: {
                            exclude: commonExclude
                        }, paranoid: false,
                    },

                    {
                        model: req.config.city, as: "quatShipCity", attributes: {
                            exclude: commonExclude
                        }, paranoid: false,
                    },
                ]
            })
            let quatProductData = await req.config.quatProducts.findAll({
                where: {
                    quat_mast_id: req.query.qm_id
                },
                include: [
                    {
                        model: req.config.products, as: "qautProduct", attributes: {
                            exclude: commonExclude
                        }, paranoid: false,
                    },
                ]
            })

            let quatTaxData = await req.config.quatTaxes.findAll({
                where: {
                    quat_mast_id: req.query.qm_id
                },
                include: [
                    {
                        model: req.config.products, as: "qautTaxProduct", attributes: {
                            exclude: commonExclude
                        }, paranoid: false,
                    },
                ]
            })

            let quatSumData = await req.config.quatTaxes.findAll({
                where: {
                    quat_mast_id: req.query.qm_id
                },
                attributes: [
                    'tax_name',
                    'tax_percentage',
                    [req.config.sequelize.fn('SUM', req.config.sequelize.col('amt')), 'total_amt']
                ],
                include: [
                    {
                        model: req.config.products, as: "qautTaxProduct", attributes: {
                            exclude: commonExclude
                        }, paranoid: false,
                    },
                ],
                group: ['tax_name']

            })
            quatation = {
                quatMasterData,
                quatProductData,
                quatTaxData,
                quatSumData
            }
        } else {
            let quatMasterData = await req.config.quatMasters.findAll({
                where: whereClause,
                include: [
                    {
                        model: req.config.opportunities, as: "quatOpportunity", attributes: {
                            exclude: commonExclude
                        },

                        include: [
                            {
                                model: req.config.accounts, as: "accName", attributes: {
                                    exclude: ["createdAt", "updatedAt", "deletedAt"]
                                }, paranoid: false
                            },
                        ],

                        paranoid: false,
                    },

                    { model: req.config.users, as: "quatOwner", attributes: ["user_id", "user"], paranoid: false, },

                    { model: req.config.users, as: "assignedQuat", attributes: ["user_id", "user"], paranoid: false, },

                    {
                        model: req.config.quatStatuses, as: "quatStatus", attributes: {
                            exclude: commonExclude
                        }, paranoid: false,
                    },

                    {
                        model: req.config.country, as: "quatCountry", attributes: {
                            exclude: commonExclude
                        }, paranoid: false,
                    },
                    {
                        model: req.config.states, as: "quatState", attributes: {
                            exclude: commonExclude
                        }, paranoid: false,
                    },

                    {
                        model: req.config.city, as: "quatCity", attributes: {
                            exclude: commonExclude
                        }, paranoid: false,
                    },
                    {
                        model: req.config.country, as: "quatShipCountry", attributes: {
                            exclude: commonExclude
                        }, paranoid: false,
                    },
                    {
                        model: req.config.states, as: "quatShipState", attributes: {
                            exclude: commonExclude
                        }, paranoid: false,
                    },

                    {
                        model: req.config.city, as: "quatShipCity", attributes: {
                            exclude: commonExclude
                        }, paranoid: false,
                    },
                ]
            })

            quatation = {
                quatMasterData,
            }
        }

        return await responseSuccess(req, res, "Quatation list", quatation)

    } catch (error) {
        logErrorToFile(error)
        console.log(error)
        return await responseError(req, res, "Something Went Wrong")
    }
}

exports.editQuatMaster = async (req, res) => {
    try {

        let { quatProductBody, quatTaxBody, quat_status, opp_id } = req.body
        let quatMasterData;

        const quotation = await req.config.quatMasters.findOne()

        if (req.user.user_id !== quotation.assigned_to && !req.user.isDB) {
            if (quat_status == 5 || quat_status == 6) {
                return await responseError(req, res, "Not Authorized to Approve or Reject")
            }
        }

        quatMasterData = await req.config.quatMasters.update(req.body, {
            where: {
                quat_mast_id: req.body.quat_mast_id,
            },
        })

        if (quatProductBody) {

            await req.config.quatProducts.destroy({
                where: {
                    quat_mast_id: req.body.quat_mast_id,
                },
                force: true
            })

            await Promise.all(quatProductBody?.map(async (item, i) => {
                item.quat_mast_id = req.body.quat_mast_id
                await req.config.quatProducts.create(item)
                return item
            }))
        }

        if (quatTaxBody) {

            await req.config.quatTaxes.destroy({
                where: {
                    quat_mast_id: req.body.quat_mast_id,
                },
                force: true
            })

            await Promise.all(quatTaxBody?.map(async (item, i) => {
                item.quat_mast_id = req.body.quat_mast_id
                await req.config.quatTaxes.create(item)
                return item
            }))
        }
        if (quat_status == 5) {
            await req.config.opportunities.update({ opportunity_stg_id: 3 }, { where: { opp_id: opp_id } })
        }
        return await responseSuccess(req, res, "quatation updated succesfully")


    } catch (error) {
        logErrorToFile(error)
        console.log(error)
        return await responseError(req, res, "Something Went Wrong")
    }
}

exports.deleteQuatMaster = async (req, res) => {
    try {

        let { qm_id } = req.query

        let quatMasterData = await req.config.quatMasters.findOne({
            where: {
                quat_mast_id: qm_id,
            }
        })
        if (!quatMasterData) return await responseError(req, res, "status name does not existed")
        await quatMasterData.destroy()
        await req.config.quatProducts.destroy({
            where: {
                quat_mast_id: qm_id
            },
        })
        await req.config.quatTaxes.destroy({
            where: {
                quat_mast_id: qm_id
            },
        })

        return await responseSuccess(req, res, "quatation deleted")

    } catch (error) {
        logErrorToFile(error)
        console.log(error)
        return await responseError(req, res, "Something Went Wrong")
    }
}