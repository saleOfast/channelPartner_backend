const { Sequelize, DataTypes, QueryTypes, where, Op } = require("sequelize");
const { responseError, responseSuccess } = require("../../helper/responce");

exports.addRating = async (req, res) => {
    try {
        const { rating_name } = req.body
        if (!rating_name || rating_name == "") {
            return await responseError(req, res, "Please Enter Rating")
        }
        let check = await req.config.rating.findOne(
            { where: { rating_name: rating_name } },
            { paranoid: false })
        if (check) {
            return await responseError(req, res, "Rating Already Exists")
        }
        let count = await req.config.rating.count({ paranoid: false })
        let data = await req.config.rating.create({
            rating_code: `RT_00${count + 1}`,
            rating_name: rating_name,
            status: true
        })
        return await responseSuccess(req, res, "Rating Created Succesfully", data)

    } catch (error) {
        logErrorToFile(error)
        console.log(error)
        return await responseError(req, res, "Something Went Wrong")
    }
}

exports.getRating = async (req, res) => {
    try {
        let data
        const { rating_id } = req.body

        if (rating_id && rating_id != null && rating_id != "") {
            data = await req.config.rating.findOne({ where: { rating_id: rating_id } })
        } else {
            data = await req.config.rating.findAll()
        }
        return await responseSuccess(req, res, "Rating Fetched Succesfully", data)

    } catch (error) {
        logErrorToFile(error)
        console.log(error)
        return await responseError(req, res, "Something Went Wrong")
    }
}

exports.updateRating = async (req, res) => {
    try {
        let data
        const { rating_id, rating_name, status } = req.body

        data = await req.config.rating.findOne({ where: { rating_id: rating_id } })
        if (!data) {
            return await responseError(req, res, "The Rating ID does not exist or disabled")
        }
        if (status == true || status == false) {
            await data.update({ status: status })
            return await responseSuccess(req, res, status ? "Rating Enabled Succesfully" : "Rating Disabled Succesfully")
        } else {
            let check = await req.config.rating.findOne(
                {
                    where: {
                        rating_name: rating_name,
                        rating_id: { [Op.ne]: rating_id }
                    }
                },
                {
                    paranoid: false
                })
            if (check) {
                return await responseError(req, res, "The Rating ID already exist")
            }
            await data.update({ rating_name: rating_name })
            return await responseSuccess(req, res, "Rating Updated Succesfully")
        }

    } catch (error) {
        logErrorToFile(error)
        console.log(error)
        return await responseError(req, res, "Something Went Wrong")
    }
}

exports.deleteRating = async (req, res) => {
    try {
        let data
        const { rating_id } = req.query

        data = await req.config.rating.findOne({ where: { rating_id: rating_id } })
        if (!data) {
            return await responseError(req, res, "The Rating ID does not exist or disabled")
        }
        await data.destroy()
        return await responseSuccess(req, res, "Rating Deleted Succesfully")

    } catch (error) {
        logErrorToFile(error)
        console.log(error)
        return await responseError(req, res, "Something Went Wrong")
    }
}

