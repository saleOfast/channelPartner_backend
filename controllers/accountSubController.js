const { Sequelize, DataTypes, QueryTypes, where, Op } = require("sequelize");
const { responseError, responseSuccess } = require('../helper/responce');
const { platform } = require("../model");


exports.storeAccountType = async (req, res) => {
    try {
        let { account_type_name } = req.body
        let accountTypeData;

        accountTypeData = await req.config.accountTypes.findOne({
            where: {
                account_type_name: account_type_name
            }
        })

        if (accountTypeData) return await responseError(req, res, "account type name already exist")

        let count = await req.config.accountTypes.count({ paranoid: false })
        let body = {
            account_type_name: account_type_name,
            account_type_code: `TP_${count + 1}`,
            platform_id: req.body.platform_id,
            status: true
        }
        accountTypeData = await req.config.accountTypes.create(body)
        return await responseSuccess(req, res, " account type created Succesfully", accountTypeData)

    } catch (error) {
        logErrorToFile(error)
        return await responseError(req, res, "Something Went Wrong")
    }
}

exports.getAccountType = async (req, res) => {
    try {
        let platform_id = req.query.platform_id ? req.query.platform_id : 1
        let accountTypeData = await req.config.accountTypes.findAll({ where: { platform_id: platform_id } })
        return await responseSuccess(req, res, " account type list", accountTypeData)

    } catch (error) {
        logErrorToFile(error)
        return await responseError(req, res, "Something Went Wrong")
    }
}

exports.editAccountType = async (req, res) => {
    try {
        let body = req.body
        if (body.account_type_name) {
            let accountTypeData = await req.config.accountTypes.findOne({
                where: {
                    account_type_code: { [Op.ne]: body.account_type_code },
                    account_type_name: body.account_type_name
                }
            })
            if (accountTypeData) return await responseError(req, res, "account type name already existed")

        }
        await req.config.accountTypes.update(body, {
            where: {
                account_type_id: body.account_type_id
            }
        })
        return await responseSuccess(req, res, "account type updated")

    } catch (error) {
        logErrorToFile(error)
        console.log("error", error)
        return await responseError(req, res, "Something Went Wrong")
    }
}

exports.deleteAccountType = async (req, res) => {
    try {

        let { act_id } = req.query
        let accountTypeData = await req.config.accountTypes.findOne({
            where: {
                account_type_id: act_id,
            }
        })

        if (!accountTypeData) return await responseError(req, res, "account type name does not existed")
        await accountTypeData.destroy()
        return await responseSuccess(req, res, "account type deleted")

    } catch (error) {
        logErrorToFile(error)
        console.log(error)
        return await responseError(req, res, "Something Went Wrong")
    }
}