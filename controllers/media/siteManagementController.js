const { Sequelize, DataTypes, QueryTypes, where, Op } = require("sequelize");
const { responseError, responseSuccess } = require("../../helper/responce");
const fileUpload = require("../../common/imageExport");


exports.addSiteCategory = async (req, res) => {
    try {
        const { site_cat_name } = req.body
        if (!site_cat_name || site_cat_name == "") {
            return await responseError(req, res, "Please Enter Site Category")
        }
        let check = await req.config.siteCategories.findOne(
            { where: { site_cat_name: site_cat_name } },
            { paranoid: false })
        if (check) {
            return await responseError(req, res, "Site Category Already Exists")
        }
        let count = await req.config.siteCategories.count({ paranoid: false })
        let data = await req.config.siteCategories.create({
            site_cat_code: `S_CAT_00${count + 1}`,
            site_cat_name: site_cat_name,
            status: true
        })
        return await responseSuccess(req, res, "Site Category Created Succesfully", data)

    } catch (error) {
        logErrorToFile(error)
        console.log(error)
        return await responseError(req, res, "Something Went Wrong")
    }
}

exports.getSiteCategory = async (req, res) => {
    try {
        let data
        const { site_cat_id } = req.query

        if (site_cat_id && site_cat_id != null && site_cat_id != "") {
            data = await req.config.siteCategories.findOne({ where: { site_cat_id: site_cat_id } })
        } else {
            data = await req.config.siteCategories.findAll()
        }
        return await responseSuccess(req, res, "Site Category Fetched Succesfully", data)

    } catch (error) {
        logErrorToFile(error)
        console.log(error)
        return await responseError(req, res, "Something Went Wrong")
    }
}

exports.updateSiteCategory = async (req, res) => {
    try {
        let data
        const { site_cat_id, site_cat_name, status } = req.body

        data = await req.config.siteCategories.findOne({ where: { site_cat_id: site_cat_id } })

        if (!data) {
            return await responseError(req, res, "The Site Category ID does not exist or disabled")
        }

        if (status == true || status == false) {
            await data.update({ status: status })
            return await responseSuccess(req, res, status ? "Site Category Enabled Succesfully" : "Site Category Disabled Succesfully")
        } else {
            let check = await req.config.siteCategories.findOne(
                {
                    where: {
                        site_cat_name: site_cat_name,
                        site_cat_id: { [Op.ne]: site_cat_id }
                    }
                },
                {
                    paranoid: false
                })
            if (check) {
                return await responseError(req, res, "The Site ID already exist")
            }
            await data.update({ site_cat_name: site_cat_name })
            return await responseSuccess(req, res, "Site Category Updated Succesfully")
        }

    } catch (error) {
        logErrorToFile(error)
        console.log(error)
        return await responseError(req, res, "Something Went Wrong")
    }
}

exports.deleteSiteCategory = async (req, res) => {
    try {
        let data
        const { site_cat_id } = req.query

        data = await req.config.siteCategories.findOne({ where: { site_cat_id: site_cat_id } })
        if (!data) {
            return await responseError(req, res, "The Site ID does not exist or disabled")
        }
        await data.destroy()
        return await responseSuccess(req, res, "Site Category Deleted Succesfully")

    } catch (error) {
        logErrorToFile(error)
        console.log(error)
        return await responseError(req, res, "Something Went Wrong")
    }
}

exports.addSite = async (req, res) => {
    try {
        let data = req.body
        let count = await req.config.sites.count({ paranoid: false })
        let cityDetails = await req.config.city.findOne({ where: { city_id: data.city_id } })
        let cityName = cityDetails.city_name.slice(0, 3)
        data.site_code = `${cityName.toUpperCase()}${`${count + 1}`.padStart(7, '0')}`
        let p_close_shot = "";
        let p_long_shot = "";
        let p_night_shot = "";

        if (data.lease_from == 'Invalid date' || data.lease_from == 'null' || data.lease_from == null || data.lease_from == 'null' || data.lease_from == '') {
            delete data.lease_from
        }
        if (data.lease_to == 'Invalid date' || data.lease_to == 'null' || data.lease_to == null || data.lease_to == 'null' || data.lease_to == '') {
            delete data.lease_to
        }
        if (data.lease_period == 'Invalid date' || data.lease_period == 'null' || data.lease_period == null || data.lease_period == 'null' || data.lease_period == '') {
            delete data.lease_period
        }
        if (data.lease_cost == 'Invalid date' || data.lease_cost == 'null' || data.lease_cost == null || data.lease_cost == 'null' || data.lease_cost == '') {
            delete data.lease_cost
        }
        if (data.available_from == 'Invalid date' || data.available_from == 'null' || data.available_from == null || data.available_from == 'null' || data.available_from == '') {
            delete data.available_from
        }
        if (data.available_to == 'Invalid date' || data.available_to == 'null' || data.available_to == null || data.available_to == 'null' || data.available_to == '') {
            delete data.available_to
        }
        if (req.files && req.files.p_close_shot) {
            p_close_shot = await fileUpload.imageExport(req, res, "SitePhotos", "p_close_shot");
            data.p_close_shot = p_close_shot;
        }

        if (req.files && req.files.p_long_shot) {
            p_long_shot = await fileUpload.imageExport(req, res, "SitePhotos", "p_long_shot");
            data.p_long_shot = p_long_shot;
        }

        if (req.files && req.files.p_night_shot) {
            p_night_shot = await fileUpload.imageExport(req, res, "SitePhotos", "p_night_shot");
            data.p_night_shot = p_night_shot;
        }

        await req.config.sites.create(data)
        return await responseSuccess(req, res, "Site Added Succesfully")

    } catch (error) {
        logErrorToFile(error)
        console.log(error)
        return await responseError(req, res, "Something Went Wrong")
    }
}

exports.getSite = async (req, res) => {
    try {
        const { site_id, city_id } = req.query;
        let cityIdArray = [];

        let query = {
            attributes: {
                include: [
                    [Sequelize.literal("width * height"), "total_area"],
                    [Sequelize.literal("selling_cost / (width * height)"), "selling_cost_per_unit"],
                    [Sequelize.literal("buying_cost / (width * height)"), "buying_cost_per_unit"],
                    [Sequelize.literal("leased_cost / (width * height)"), "leased_cost_per_unit"],
                    [Sequelize.literal("card_rate / (width * height)"), "card_cost_per_unit"],
                    [Sequelize.literal("selling_cost / 30"), "selling_cost_per_day"],
                    [Sequelize.literal("buying_cost / 30"), "buying_cost_per_day"],
                    [Sequelize.literal("leased_cost / 30"), "leased_cost_per_day"],
                    [Sequelize.literal("card_rate / 30"), "card_cost_per_day"],
                ]
            },
            include: [
                { model: req.config.accounts, paranoid: false },
                { model: req.config.siteCategories, paranoid: false },
                { model: req.config.mediaFormat, paranoid: false },
                { model: req.config.mediaVehicle, paranoid: false },
                { model: req.config.mediaType, paranoid: false },
                { model: req.config.siteStatus, paranoid: false },
                { model: req.config.rating, paranoid: false },
                { model: req.config.availabiltyStatus, paranoid: false },
                { model: req.config.country, paranoid: false },
                { model: req.config.states, paranoid: false },
                { model: req.config.city, paranoid: false },
            ],
            order: [
                ['site_id', 'DESC']
            ]
        };

        query.where = {};

        if (site_id) {
            query.where.site_id = site_id;
        }

        if (city_id) {
            cityIdArray = city_id.split(',').map(id => parseInt(id.trim()));
        }

        if (cityIdArray.length > 0) {
            query.where.city_id = { [Op.in]: cityIdArray };
        }

        let data;
        if (site_id) {
            data = await req.config.sites.findOne(query);
        } else {
            data = await req.config.sites.findAll(query);
        }

        return await responseSuccess(req, res, "Sites Fetched Successfully", data);
    } catch (error) {
        logErrorToFile(error);
        console.log(error);
        return await responseError(req, res, "Something Went Wrong");
    }
};

exports.updateSite = async (req, res) => {
    try {
        const { site_id } = req.body
        let data = req.body
        let p_close_shot = "";
        let p_long_shot = "";
        let p_night_shot = "";

        let body = await req.config.sites.findOne({ where: { site_id: site_id } })
        if (!body) {
            return await responseError(req, res, "The Site does not exist.")
        }
        if (data.lease_from == 'Invalid date' || data.lease_from == 'null' || data.lease_from == null || data.lease_from == 'null' || data.lease_from == '') {
            delete data.lease_from
        }
        if (data.lease_to == 'Invalid date' || data.lease_to == 'null' || data.lease_to == null || data.lease_to == 'null' || data.lease_to == '') {
            delete data.lease_to
        }
        if (data.lease_period == 'Invalid date' || data.lease_period == 'null' || data.lease_period == null || data.lease_period == 'null' || data.lease_period == '') {
            delete data.lease_period
        }
        if (data.lease_cost == 'Invalid date' || data.lease_cost == 'null' || data.lease_cost == null || data.lease_cost == 'null' || data.lease_cost == '') {
            delete data.lease_cost
        }
        if (req.files && req.files.p_close_shot) {
            p_close_shot = await fileUpload.imageExport(req, res, "SitePhotos", "p_close_shot");
            data.p_close_shot = p_close_shot;
        }

        if (req.files && req.files.p_long_shot) {
            p_long_shot = await fileUpload.imageExport(req, res, "SitePhotos", "p_long_shot");
            data.p_long_shot = p_long_shot;
        }

        if (req.files && req.files.p_night_shot) {
            p_night_shot = await fileUpload.imageExport(req, res, "SitePhotos", "p_night_shot");
            data.p_night_shot = p_night_shot;
        }

        await body.update(data)
        return await responseSuccess(req, res, "Site Updated Succesfully")

    } catch (error) {
        logErrorToFile(error)
        console.log(error)
        return await responseError(req, res, "Something Went Wrong")
    }
}

exports.deleteSite = async (req, res) => {
    try {
        let { site_id } = req.query
        let data = await req.config.sites.findOne({ where: { site_id: site_id } })

        if (!data) {
            return await responseError(req, res, "The Site does not exist.")
        }
        await data.destroy()
        return await responseSuccess(req, res, "Site Deleted Succesfully")

    } catch (error) {
        logErrorToFile(error)
        console.log(error)
        return await responseError(req, res, "Something Went Wrong")
    }
}