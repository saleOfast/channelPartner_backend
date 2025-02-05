const { Sequelize, DataTypes, QueryTypes, where, Op } = require("sequelize");
const { responseError, responseSuccess } = require("../../helper/responce");

exports.addConversionPercentage = async (req, res) => {
    try {
        const { conversion_amount } = req.body
        if (!conversion_amount || conversion_amount == "") {
            return await responseError(req, res, "Please Enter Conversion Percentage")
        }
        let check = await req.config.conversionPercentage.findOne(
            { where: { conversion_amount: conversion_amount } },
            { paranoid: false })
        if (check) {
            return await responseError(req, res, "Conversion Percentage Already Exists")
        }
        let count = await req.config.conversionPercentage.count({ paranoid: false })
        let data = await req.config.conversionPercentage.create({
            conversion_code: `C_P_${(count + 1).toString().padStart(7, '0')}`,
            conversion_amount: conversion_amount,
            status: true
        })
        return await responseSuccess(req, res, "Conversion Percentage Created Succesfully", data)

    } catch (error) {
        logErrorToFile(error)
        console.log(error)
        return await responseError(req, res, "Something Went Wrong")
    }
}

exports.getConversionPercentage = async (req, res) => {
    try {
        let data
        const { conversion_id } = req.body

        if (conversion_id && conversion_id != null && conversion_id != "") {
            data = await req.config.conversionPercentage.findOne({ where: { conversion_id: conversion_id } })
        } else {
            data = await req.config.conversionPercentage.findAll()
        }
        return await responseSuccess(req, res, "Conversion Percentage Fetched Succesfully", data)

    } catch (error) {
        logErrorToFile(error)
        console.log(error)
        return await responseError(req, res, "Something Went Wrong")
    }
}

exports.updateConversionPercentage = async (req, res) => {
    try {
        let data
        const { conversion_id, conversion_amount, status } = req.body

        data = await req.config.conversionPercentage.findOne({ where: { conversion_id: conversion_id } })
        if (!data) {
            return await responseError(req, res, "The Conversion Percentage ID does not exist or disabled")
        }
        if (status == true || status == false) {
            await data.update({ status: status })
            return await responseSuccess(req, res, status ? "Conversion Percentage Enabled Succesfully" : "Conversion Percentage Disabled Succesfully")
        } else {
            let check = await req.config.conversionPercentage.findOne(
                {
                    where: {
                        conversion_amount: conversion_amount,
                        conversion_id: { [Op.ne]: conversion_id }
                    }
                },
                {
                    paranoid: false
                })
            if (check) {
                return await responseError(req, res, "The Conversion Percentage ID already exist")
            }
            await data.update({ conversion_amount: conversion_amount })
            return await responseSuccess(req, res, "Conversion Percentage Updated Succesfully")
        }

    } catch (error) {
        logErrorToFile(error)
        console.log(error)
        return await responseError(req, res, "Something Went Wrong")
    }
}

exports.deleteConversionPercentage = async (req, res) => {
    try {
        let data
        const { conversion_id } = req.query

        data = await req.config.conversionPercentage.findOne({ where: { conversion_id: conversion_id } })
        if (!data) {
            return await responseError(req, res, "The Conversion Percentage ID does not exist or disabled")
        }
        await data.destroy()
        return await responseSuccess(req, res, "Conversion Percentage Deleted Succesfully")

    } catch (error) {
        logErrorToFile(error)
        console.log(error)
        return await responseError(req, res, "Something Went Wrong")
    }
}

