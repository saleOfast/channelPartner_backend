const { Sequelize, DataTypes, QueryTypes, where, Op } = require("sequelize");
const { responseError, responseSuccess } = require("../../helper/responce");

exports.addEstimationAssetBusiness = async (req, res) => {
    try {
        const { sites, estimate_id, start_date, end_date, duration } = req.body;
        let dataArray = []

        if (!estimate_id || estimate_id === "") {
            return await responseError(req, res, "Please Enter estimate_id");
        }

        if (!Array.isArray(sites) || sites.length === 0) {
            return await responseError(req, res, "Please provide a valid sites array");
        }

        const results = [];

        for (const site of sites) {
            const { site_id, status } = site;

            // Check if the record exists
            let check = await req.config.estimationForAssetBusiness.findOne(
                { where: { site_id: site_id, estimate_id: estimate_id }, paranoid: false }
            );

            if (check) {
                // Update the existing record
                check.status = status;
                await check.save();
                results.push({ site_id, estimate_id, action: "updated" });
            } else {
                // Create a new record
                let data = await req.config.estimationForAssetBusiness.create({
                    site_id: site_id,
                    estimate_id: estimate_id,
                    status: status,
                    start_date: start_date,
                    end_date: end_date,
                    duration: duration,
                    approval_status: 'NEGOTIATING'
                });
                results.push({ site_id, estimate_id, action: "created", data });
            }
        }

        let approvalRoles = await req.config.settings.findOne({ where: { setting_id: 3 } })

        approvalRoles = approvalRoles.setting_value.split(',').map(item => parseInt(item.trim()));

        for (let i = 0; i < approvalRoles.length; i++) {
            let check = await req.config.estimateApprovals.findOne({
                where: {
                    role_id: approvalRoles[i],
                    estimate_id: estimate_id,
                },
                paranoid: false,
            });
            if (!check) {
                const element = {
                    role_id: approvalRoles[i],
                    site_type: "AGENCY",
                    approval_status: false,
                    responded: false,
                    estimate_id: estimate_id,
                    status: true,
                    approved_by: null,
                };
                dataArray.push(element);
            }
        }
        let approvals = await req.config.estimateApprovals.bulkCreate(dataArray);
        return await responseSuccess(req, res, "Operations completed successfully", results);

    } catch (error) {
        logErrorToFile(error);
        console.log(error);
        return await responseError(req, res, "Something Went Wrong");
    }
};

exports.getEstiamtionAssetBusiness = async (req, res) => {
    try {
        let data
        const { estimate_id } = req.query

        if (estimate_id && estimate_id != null && estimate_id != "") {
            data = await req.config.estimationForAssetBusiness.findAll({
                where: { estimate_id: estimate_id, status: true },
                attributes: {
                    include: [
                        [Sequelize.literal("width * height"), "total_area"],
                    ]
                },
                include: [
                    {
                        model: req.config.sites, paranoid: false,
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
                    },
                    {
                        model: req.config.estimations, paranoid: false,
                        include: [
                            { model: req.config.mediaCampaignManagement, paranoid: false },
                        ],
                    },
                ]
            })
        }
        return await responseSuccess(req, res, "Estimate Asset Business Fetched Succesfully", data)

    } catch (error) {
        logErrorToFile(error)
        console.log(error)
        return await responseError(req, res, "Something Went Wrong")
    }
}

exports.updateEstiamtionAssetBusiness = async (req, res) => {
    try {
        const { site_id, estimate_id, sb_id, start_date, end_date, duration } = req.body

        let data = await req.config.estimationForAssetBusiness.findOne({
            where: { site_id: site_id, estimate_id: estimate_id }
        })
        let siteBooking = await req.config.siteBookingHistory.findOne({
            where: { sb_id: sb_id }
        })
        if(!siteBooking){
            return await responseError(req, res, "Specified Site Booking does not exist")
        }
        if (!data) {
            return await responseError(req, res, "Specified Site does not exist")
        }
        data.update({ start_date: start_date, end_date: end_date, duration: duration })
        siteBooking.update({ start_date: start_date, end_date: end_date, duration: duration })
        return await responseSuccess(req, res, "Estimate Asset Business Updated Succesfully", data)

    } catch (error) {
        logErrorToFile(error)
        console.log(error)
        return await responseError(req, res, "Something Went Wrong")
    }
}

exports.deleteEstiamtionAssetBusiness = async (req, res) => {
    try {
        let data
        const { estimate_id } = req.query

        data = await req.config.estimationForAssetBusiness.findOne({ where: { estimate_id: estimate_id } })
        if (!data) {
            return await responseError(req, res, "The Estimate Asset Business ID does not exist or disabled")
        }
        await data.destroy()
        return await responseSuccess(req, res, "Estimate Asset Business Deleted Succesfully")

    } catch (error) {
        logErrorToFile(error)
        console.log(error)
        return await responseError(req, res, "Something Went Wrong")
    }
}

