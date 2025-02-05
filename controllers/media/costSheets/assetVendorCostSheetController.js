const { Sequelize, DataTypes, QueryTypes, where, Op } = require("sequelize");
const { responseError, responseSuccess } = require("../../../helper/responce");

exports.createAssetVendorCostSheet = async (req, res) => {
    try {
        const { site_id, eab_id, campaign_id, mounting_vendor_id, mounting_cost_per_sq_ft, printing_vendor_id, pr_m_id, printing_cost_per_sq_ft, final_display_cost, buying_price_as_per_duration, mounting_cost, printing_cost, remarks } = req.body;
        let body = req.body

        const [site, estimate, campaign] = await Promise.all([
            req.config.sites.findOne({ where: { site_id: site_id } }),
            req.config.estimationForAssetBusiness.findOne({ where: { eab_id: eab_id } }),
            req.config.mediaCampaignManagement.findOne({ where: { campaign_id: campaign_id } })
        ]);

        const estimate_id = estimate.estimate_id || estimate.dataValues.estimate_id
        if (!estimate_id) {
            return await responseError(req, res, "Estimate ID is required");
        }
        const costSheet = await req.config.assetVendorCostSheet.create(body);

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
        });

        // Fetch all site_ids and eab_ids
        const siteIds = data.map(record => record.site_id);
        const eabIds = data.map(record => record.eab_id);

        // Fetch client cost sheets that match the site_id and eab_id
        const vendorCostSheets = await req.config.assetVendorCostSheet.findAll({
            where: {
                site_id: { [Op.in]: siteIds },
                eab_id: { [Op.in]: eabIds }
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
                { model: req.config.estimationForAssetBusiness, paranoid: false },
                { model: req.config.mediaCampaignManagement, paranoid: false },
                { model: req.config.printingMaterial, paranoid: false },
                { model: req.config.accounts, as: 'printingVendor', foreignKey: 'printing_vendor_id', paranoid: false },
                { model: req.config.accounts, as: 'mountingVendor', foreignKey: 'mounting_vendor_id', paranoid: false },
            ]
        });

        const costSheetMap = {};
        vendorCostSheets.forEach(sheet => {
            costSheetMap[`${sheet.site_id}_${sheet.eab_id}`] = sheet;
        });

        const responseData = data.map(record => {
            const key = `${record.site_id}_${record.eab_id}`;
            return costSheetMap[key] ? costSheetMap[key] : record;
        });
        const homogenizedResponse = responseData.map(item => {
            return {
                site_id: item.site_id || null,
                site_code: item.db_site.site_code || null,
                vcs_id: item.vcs_id || null,
                campaign_id: item.campaign_id || item.db_estimate.campaign_id || null,
                eab_id: item.eab_id || null,
                estimate_id: item.estimate_id || item?.db_estimation_asset_business?.estimate_id || null,
                state_id: item.db_site.db_state.state_id || null,
                state: item.db_site.db_state.state_name || null,
                city_id: item.db_site.db_city.city_id || null,
                city: item.db_site.db_city.city_name || null,
                location: item.location || item.db_site.location || null,
                category: item.category || item.db_site.db_site_category.site_cat_name || null,
                media_format: item.media_format || item.db_site.db_media_format.m_f_name || null,
                media_vehicle: item.media_vehicle || item.db_site.db_media_vehicle.m_v_name || null,
                media_type: item.db_site.db_media_type.m_t_name || null,
                m_t_id: item.db_site.db_media_type.m_t_id || null,
                quantity: item.quantity || item.db_site.quantity || 0,
                width: item.width || item.db_site.width || 0,
                height: item.height || item.db_site.height || 0,
                total_sq_ft: item.width * item.height || item.db_site.width * item.db_site.height || 0,
                item: item,
                start_date: item?.start_date || item?.db_estimation_asset_business?.start_date || item.campaign_start_date || item.db_estimate.db_media_campaign.campaign_start_date || null,
                end_date: item?.end_date || item?.db_estimation_asset_business?.end_date || item.campaign_end_date || item.db_estimate.db_media_campaign.campaign_end_date || null,
                duration: item?.duration || item?.db_estimation_asset_business?.duration || Number(Math.floor((new Date(item?.end_date || item?.db_estimation_asset_business?.end_date) - new Date(item?.start_date)) / (1000 * 60 * 60 * 24))) || Number(item.campaign_duration) || Number(Math.floor((new Date(item.campaign_end_date) - new Date(item.campaign_start_date)) / (1000 * 60 * 60 * 24))) || 0,

                campaign_start_date: item.campaign_start_date || item.db_estimate.db_media_campaign.campaign_start_date || null,
                campaign_end_date: item.campaign_end_date || item.db_estimate.db_media_campaign.campaign_end_date || null,
                campaign_duration: Number(item.campaign_duration) || Number(Math.floor((new Date(item?.db_estimate?.db_media_campaign?.campaign_end_date) - new Date(item?.db_estimate?.db_media_campaign?.campaign_start_date)) / (1000 * 60 * 60 * 24))) || 0,

                display_cost_per_month: item.display_cost_per_month || item.db_site.buying_cost || 0,
                final_client_po_cost: item.final_client_po_cost || 0,
                final_display_cost: item.final_display_cost || 0,
                buying_price_as_per_duration: (function () {
                    const displayCost = Number(item?.display_cost_per_month) || 0;
                    const sellingCost = Number(item?.db_site?.buying_cost) || 0;
                    const price = Number(
                        displayCost / 30 *
                        (
                            Number(item?.duration || item?.db_estimation_asset_business?.duration) ||
                            Number(Math.floor((new Date(item?.end_date || item?.db_estimation_asset_business?.end_date) - new Date(item?.start_date || item?.db_estimation_asset_business?.start_date)) / (1000 * 60 * 60 * 24))) ||
                            Number(item.campaign_duration) ||
                            Number(Math.floor((new Date(item.campaign_end_date) - new Date(item.campaign_start_date)) / (1000 * 60 * 60 * 24)))))
                        ||
                        Number(
                            sellingCost / 30 * (
                                Number(item?.duration || item?.db_estimation_asset_business?.duration) ||
                                Number(Math.floor((new Date(item?.end_date || item?.db_estimation_asset_business?.end_date) - new Date(item?.start_date || item?.db_estimation_asset_business?.start_date)) / (1000 * 60 * 60 * 24))) ||
                                Number(item?.db_estimate?.db_media_campaign?.campaign_duration) ||
                                Number(Math.floor((new Date(item?.db_estimate?.db_media_campaign?.campaign_end_date) - new Date(item?.db_estimate?.db_media_campaign?.campaign_start_date)) / (1000 * 60 * 60 * 24)))));
                    return Number(price.toFixed(2)) || 0;
                })(),
                mounting_cost_per_sq_ft: item.mounting_cost_per_sq_ft || 0,
                mounting_cost: item.mounting_cost || item.mounting_cost_per_sq_ft * item.total_area || 0,

                printing_cost_per_sq_ft: item.printing_cost_per_sq_ft || 0,
                printing_cost: item.printing_cost || item.printing_cost_per_sq_ft * item.total_area || 0,
                remarks: item.remarks || item.db_site.remarks || null,

                display_vendor_name: item?.db_site?.db_account?.acc_name || null,

                printing_vendor_id: item?.printingVendor?.acc_id || null,
                printing_vendor_name: item?.printingVendor?.acc_name || null,
                pr_m_id: item?.db_printing_material?.pr_m_id || null,
                pr_m_name: item?.db_printing_material?.pr_m_name || null,

                m_f_id: item?.db_site?.db_media_type?.m_f_id || null,
                m_f_name: item?.db_site?.db_media_type?.m_f_name || null,
                mounting_vendor_id: item?.mountingVendor?.acc_id || null,
                mounting_vendor_name: item?.mountingVendor?.acc_name || null,
            };
        })
        const totals = {
            buying_price_as_per_duration: homogenizedResponse.reduce((acc, item) => acc + item.buying_price_as_per_duration, 0),
            mounting_cost: homogenizedResponse.reduce((acc, item) => acc + item.mounting_cost, 0),
            printing_cost: homogenizedResponse.reduce((acc, item) => acc + item.printing_cost, 0)
        };

        if (!site) {
            return responseError(req, res, "Invalid site id.");
        }
        if (!estimate) {
            return responseError(req, res, "Invalid estimate id.");
        }
        if (!campaign) {
            return responseError(req, res, "Invalid campaign id.");
        }

        if (campaign_id) {
            if (totals.buying_price_as_per_duration) {
                let update = await req.config.mediaCampaignManagement.update({ total_vendor_display_cost: totals.buying_price_as_per_duration }, { where: { campaign_id: campaign_id } })
            }
            if (totals.mounting_cost) {
                let update = await req.config.mediaCampaignManagement.update({ total_vendor_mounting_cost: totals.mounting_cost }, { where: { campaign_id: campaign_id } })
            }
            if (totals.printing_cost) {
                let update = await req.config.mediaCampaignManagement.update({ total_vendor_printing_cost: totals.printing_cost }, { where: { campaign_id: campaign_id } })
            }
            const total_client_cost = Number(totals.buying_price_as_per_duration) + Number(totals.mounting_cost) + Number(totals.printing_cost)
            let update = await req.config.mediaCampaignManagement.update({ total_vendor_cost: Number(total_client_cost) }, { where: { campaign_id: campaign_id } })

        }
        if (estimate_id) {
            if (totals.buying_price_as_per_duration) {
                let update = await req.config.estimations.update({ display_buying_cost: totals.buying_price_as_per_duration }, { where: { estimate_id: estimate_id } })
            }
            if (totals.mounting_cost) {
                let update = await req.config.estimations.update({ mounting_buying_cost: totals.mounting_cost }, { where: { estimate_id: estimate_id } })
            }
            if (totals.printing_cost) {
                let update = await req.config.estimations.update({ printing_buying_cost: totals.printing_cost }, { where: { estimate_id: estimate_id } })
            }
            const total_client_cost = Number(totals.buying_price_as_per_duration) + Number(totals.mounting_cost) + Number(totals.printing_cost)
            let update = await req.config.estimations.update({ total_buying_cost: Number(total_client_cost) }, { where: { estimate_id: estimate_id } })

            const estimateData = await req.config.estimations.findOne({ where: { estimate_id: estimate_id } })
            const campaignData = await req.config.mediaCampaignManagement.findOne({ where: { campaign_id: campaign_id } })
            const { total_selling_cost, total_buying_cost, display_selling_cost, display_buying_cost, printing_selling_cost, printing_buying_cost, mounting_selling_cost, mounting_buying_cost, vendor_tax, client_tax } = estimateData

            let updatedEstimate = await estimateData.update({
                overall_margin: parseFloat(Number(total_selling_cost) - Number(total_buying_cost) || 0),
                display_margin: parseFloat(Number(display_selling_cost) - Number(display_buying_cost) || 0),
                printing_margin: parseFloat(Number(printing_selling_cost) - Number(printing_buying_cost) || 0),
                mounting_margin: parseFloat(Number(mounting_selling_cost) - Number(mounting_buying_cost) || 0),
                overall_margin_percentage: parseFloat((Number(total_selling_cost) - Number(total_buying_cost)) / Number(total_selling_cost) * 100 || 0),
                display_margin_percentage: parseFloat((Number(display_selling_cost) - Number(display_buying_cost)) / Number(display_selling_cost) * 100 || 0),
                printing_margin_percentage: parseFloat((Number(printing_selling_cost) - Number(printing_buying_cost)) / Number(printing_selling_cost) * 100 || 0),
                mounting_margin_percentage: parseFloat((Number(mounting_selling_cost) - Number(mounting_buying_cost)) / Number(mounting_selling_cost) * 100 || 0),
                total_client_cost_without_tax: (Number(total_selling_cost) || 0),
                total_vendor_cost_without_tax: (Number(total_buying_cost) || 0),
                total_client_cost_with_tax: ((Number(total_selling_cost) + Number(client_tax || 0)) || 0),
                total_vendor_cost_with_tax: ((Number(total_buying_cost) + Number(vendor_tax || 0)) || 0),
            })
            let updatedCampaign = await campaignData.update({
                overall_margin: parseFloat(Number(total_selling_cost) - Number(total_buying_cost) || 0),
                display_margin: parseFloat(Number(display_selling_cost) - Number(display_buying_cost) || 0),
                printing_margin: parseFloat(Number(printing_selling_cost) - Number(printing_buying_cost) || 0),
                mounting_margin: parseFloat(Number(mounting_selling_cost) - Number(mounting_buying_cost) || 0),
                overall_margin_percentage: parseFloat((Number(total_selling_cost) - Number(total_buying_cost)) / Number(total_selling_cost) * 100 || 0),
                display_margin_percentage: parseFloat((Number(display_selling_cost) - Number(display_buying_cost)) / Number(display_selling_cost) * 100 || 0),
                printing_margin_percentage: parseFloat((Number(printing_selling_cost) - Number(printing_buying_cost)) / Number(printing_selling_cost) * 100 || 0),
                mounting_margin_percentage: parseFloat((Number(mounting_selling_cost) - Number(mounting_buying_cost)) / Number(mounting_selling_cost) * 100 || 0),
                total_client_cost_without_tax: (Number(total_selling_cost) || 0),
                total_vendor_cost_without_tax: (Number(total_buying_cost) || 0),
                total_client_cost_with_tax: ((Number(total_selling_cost) + Number(client_tax || 0)) || 0),
                total_vendor_cost_with_tax: ((Number(total_buying_cost) + Number(vendor_tax || 0)) || 0),
            })
        }

        // const checkData = await req.config.estimationForAssetBusiness.findAll({ where: { estimate_id: estimate_id, status: true } })
        // const site_ids = checkData.map(record => record.site_id);
        // const eab_ids = checkData.map(record => record.eab_id);
        // const _vendorCostSheets = await req.config.assetVendorCostSheet.findAll({
        //     where: {
        //         site_id: { [Op.in]: site_ids },
        //         eab_id: { [Op.in]: eab_ids }
        //     }
        // })
        // if (checkData.length == _vendorCostSheets.length) {
        //     await req.config.estimations.update({ approval_status: 'NEGOTIATION COMPLETED' }, { where: { estimate_id: estimate_id } })
        // }

        return responseSuccess(req, res, "Vendor Cost Sheet Created Successfully", costSheet);
    } catch (error) {
        logErrorToFile(error)
        console.log(error)
        return await responseError(req, res, "Something Went Wrong")
    }
};

exports.getAssetVendorCostSheet = async (req, res) => {
    try {
        const { vcs_id, site_id, eab_id } = req.query;

        let data;
        if (vcs_id && vcs_id !== null && vcs_id !== "") {
            data = await req.config.assetVendorCostSheet.findOne(
                {
                    where: { vcs_id: vcs_id },
                    include: [
                        { model: req.config.sites, paranoid: false },
                        { model: req.config.estimationForAssetBusiness, paranoid: false },
                        { model: req.config.mediaCampaignManagement, paranoid: false },
                        { model: req.config.accounts, as: 'printingVendorAsset', foreignKey: 'printing_vendor_id', paranoid: false },
                        { model: req.config.accounts, as: 'mountingVendorAsset', foreignKey: 'mounting_vendor_id', paranoid: false },
                        { model: req.config.accounts, as: 'displayVendor', foreignKey: 'display_vendor_id', paranoid: false },
                    ]
                }
            );
        }
        if (site_id && site_id !== null && site_id !== "") {
            data = await req.config.assetVendorCostSheet.findOne(
                {
                    where: { site_id: site_id, eab_id: eab_id },
                    include: [
                        { model: req.config.sites, paranoid: false },
                        { model: req.config.estimationForAssetBusiness, paranoid: false },
                        { model: req.config.mediaCampaignManagement, paranoid: false },
                        { model: req.config.accounts, as: 'printingVendor', foreignKey: 'printing_vendor_id', paranoid: false },
                        { model: req.config.accounts, as: 'mountingVendor', foreignKey: 'mounting_vendor_id', paranoid: false },
                        { model: req.config.accounts, as: 'displayVendor', foreignKey: 'display_vendor_id', paranoid: false },
                    ]
                }
            );
        }
        else {
            data = await req.config.assetVendorCostSheet.findAll();
        }

        return responseSuccess(req, res, "Vendor Cost Sheet Fetched Successfully", data);
    } catch (error) {
        logErrorToFile(error)
        console.log(error)
        return await responseError(req, res, "Something Went Wrong")
    }
};

exports.updateAssetVendorCostSheet = async (req, res) => {
    try {
        const { vcs_id, site_id, eab_id, campaign_id, mounting_vendor_id, mounting_cost_per_sq_ft, printing_vendor_id, pr_m_id, printing_cost_per_sq_ft, final_display_cost, buying_price_as_per_duration, mounting_cost, printing_cost, remarks } = req.body;
        let body = req.body

        // Validate foreign keys
        const [site, estimate, campaign] = await Promise.all([
            req.config.sites.findOne({ where: { site_id: site_id } }),
            req.config.estimationForAssetBusiness.findOne({ where: { eab_id: eab_id } }),
            req.config.mediaCampaignManagement.findOne({ where: { campaign_id: campaign_id } })
        ]);

        const estimate_id = estimate.estimate_id || estimate.dataValues.estimate_id

        const costSheet = await req.config.assetVendorCostSheet.findOne({ where: { vcs_id: vcs_id } });
        if (!costSheet) {
            return responseError(req, res, "Cost Sheet not found.");
        }

        const updatedCostSheet = await costSheet.update(body);

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
        });

        // Fetch all site_ids and eab_ids
        const siteIds = data.map(record => record.site_id);
        const eabIds = data.map(record => record.eab_id);

        // Fetch client cost sheets that match the site_id and eab_id
        const vendorCostSheets = await req.config.assetVendorCostSheet.findAll({
            where: {
                site_id: { [Op.in]: siteIds },
                eab_id: { [Op.in]: eabIds }
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
                { model: req.config.estimationForAssetBusiness, paranoid: false },
                { model: req.config.mediaCampaignManagement, paranoid: false },
                { model: req.config.printingMaterial, paranoid: false },
                { model: req.config.accounts, as: 'printingVendor', foreignKey: 'printing_vendor_id', paranoid: false },
                { model: req.config.accounts, as: 'mountingVendor', foreignKey: 'mounting_vendor_id', paranoid: false },
            ]
        });

        const costSheetMap = {};
        vendorCostSheets.forEach(sheet => {
            costSheetMap[`${sheet.site_id}_${sheet.eab_id}`] = sheet;
        });

        const responseData = data.map(record => {
            const key = `${record.site_id}_${record.eab_id}`;
            return costSheetMap[key] ? costSheetMap[key] : record;
        });
        const homogenizedResponse = responseData.map(item => {
            return {
                site_id: item.site_id || null,
                site_code: item.db_site.site_code || null,
                vcs_id: item.vcs_id || null,
                campaign_id: item.campaign_id || item.db_estimate.campaign_id || null,
                eab_id: item.eab_id || null,
                estimate_id: item.estimate_id || item?.db_estimation_asset_business?.estimate_id || null,
                state_id: item.db_site.db_state.state_id || null,
                state: item.db_site.db_state.state_name || null,
                city_id: item.db_site.db_city.city_id || null,
                city: item.db_site.db_city.city_name || null,
                location: item.location || item.db_site.location || null,
                category: item.category || item.db_site.db_site_category.site_cat_name || null,
                media_format: item.media_format || item.db_site.db_media_format.m_f_name || null,
                media_vehicle: item.media_vehicle || item.db_site.db_media_vehicle.m_v_name || null,
                media_type: item.db_site.db_media_type.m_t_name || null,
                m_t_id: item.db_site.db_media_type.m_t_id || null,
                quantity: item.quantity || item.db_site.quantity || 0,
                width: item.width || item.db_site.width || 0,
                height: item.height || item.db_site.height || 0,
                total_sq_ft: item.width * item.height || item.db_site.width * item.db_site.height || 0,

                start_date: item?.start_date || item?.db_estimation_asset_business?.start_date || item.campaign_start_date || item.db_estimate.db_media_campaign.campaign_start_date || null,
                end_date: item?.end_date || item?.db_estimation_asset_business?.end_date || item.campaign_end_date || item.db_estimate.db_media_campaign.campaign_end_date || null,
                duration: item?.duration || item?.db_estimation_asset_business?.duration || Number(Math.floor((new Date(item?.end_date || item?.db_estimation_asset_business?.end_date) - new Date(item?.start_date || item?.db_estimation_asset_business?.start_date)) / (1000 * 60 * 60 * 24))) || Number(item.campaign_duration) || Number(Math.floor((new Date(item.campaign_end_date) - new Date(item.campaign_start_date)) / (1000 * 60 * 60 * 24))) || 0,

                campaign_start_date: item.campaign_start_date || item.db_estimate.db_media_campaign.campaign_start_date || null,
                campaign_end_date: item.campaign_end_date || item.db_estimate.db_media_campaign.campaign_end_date || null,
                campaign_duration: Number(item.campaign_duration) || Number(Math.floor((new Date(item?.db_estimate?.db_media_campaign?.campaign_end_date) - new Date(item?.db_estimate?.db_media_campaign?.campaign_start_date)) / (1000 * 60 * 60 * 24))) || 0,

                display_cost_per_month: item.display_cost_per_month || item.db_site.buying_cost || 0,
                final_client_po_cost: item.final_client_po_cost || 0,
                final_display_cost: item.final_display_cost || 0,
                buying_price_as_per_duration: (function () {
                    const displayCost = Number(item?.display_cost_per_month) || 0;
                    const sellingCost = Number(item?.db_site?.buying_cost) || 0;
                    const price = Number(
                        displayCost / 30 *
                        (
                            Number(item?.duration || item?.db_estimation_asset_business?.duration) ||
                            Number(Math.floor((new Date(item?.end_date || item?.db_estimation_asset_business?.end_date) - new Date(item?.start_date || item?.db_estimation_asset_business?.start_date)) / (1000 * 60 * 60 * 24))) ||
                            Number(item.campaign_duration) ||
                            Number(Math.floor((new Date(item.campaign_end_date) - new Date(item.campaign_start_date)) / (1000 * 60 * 60 * 24)))))
                        ||
                        Number(
                            sellingCost / 30 * (
                                Number(item?.duration || item?.db_estimation_asset_business?.duration) ||
                                Number(Math.floor((new Date(item?.end_date || item?.db_estimation_asset_business?.end_date) - new Date(item?.start_date || item?.db_estimation_asset_business?.start_date)) / (1000 * 60 * 60 * 24))) ||
                                Number(item?.db_estimate?.db_media_campaign?.campaign_duration) ||
                                Number(Math.floor((new Date(item?.db_estimate?.db_media_campaign?.campaign_end_date) - new Date(item?.db_estimate?.db_media_campaign?.campaign_start_date)) / (1000 * 60 * 60 * 24)))));
                    return Number(price.toFixed(2)) || 0;
                })(),
                mounting_cost_per_sq_ft: item.mounting_cost_per_sq_ft || 0,
                mounting_cost: item.mounting_cost || item.mounting_cost_per_sq_ft * item.total_area || 0,

                printing_cost_per_sq_ft: item.printing_cost_per_sq_ft || 0,
                printing_cost: item.printing_cost || item.printing_cost_per_sq_ft * item.total_area || 0,
                remarks: item.remarks || item.db_site.remarks || null,

                display_vendor_name: item?.db_site?.db_account?.acc_name || null,

                printing_vendor_id: item?.printingVendor?.acc_id || null,
                printing_vendor_name: item?.printingVendor?.acc_name || null,
                pr_m_id: item?.db_printing_material?.pr_m_id || null,
                pr_m_name: item?.db_printing_material?.pr_m_name || null,

                m_f_id: item?.db_site?.db_media_type?.m_f_id || null,
                m_f_name: item?.db_site?.db_media_type?.m_f_name || null,
                mounting_vendor_id: item?.mountingVendor?.acc_id || null,
                mounting_vendor_name: item?.mountingVendor?.acc_name || null,
            };
        })
        const totals = {
            buying_price_as_per_duration: homogenizedResponse.reduce((acc, item) => acc + item.buying_price_as_per_duration, 0),
            mounting_cost: homogenizedResponse.reduce((acc, item) => acc + item.mounting_cost, 0),
            printing_cost: homogenizedResponse.reduce((acc, item) => acc + item.printing_cost, 0)
        };

        if (!site) {
            return responseError(req, res, "Invalid site id.");
        }
        if (!estimate) {
            return responseError(req, res, "Invalid estimate id.");
        }
        if (!campaign) {
            return responseError(req, res, "Invalid campaign id.");
        }

        if (campaign_id) {
            if (totals.buying_price_as_per_duration) {
                let update = await req.config.mediaCampaignManagement.update({ total_vendor_display_cost: totals.buying_price_as_per_duration }, { where: { campaign_id: campaign_id } })
            }
            if (totals.mounting_cost) {
                let update = await req.config.mediaCampaignManagement.update({ total_vendor_mounting_cost: totals.mounting_cost }, { where: { campaign_id: campaign_id } })
            }
            if (totals.printing_cost) {
                let update = await req.config.mediaCampaignManagement.update({ total_vendor_printing_cost: totals.printing_cost }, { where: { campaign_id: campaign_id } })
            }
            const total_client_cost = Number(totals.buying_price_as_per_duration) + Number(totals.mounting_cost) + Number(totals.printing_cost)
            let update = await req.config.mediaCampaignManagement.update({ total_vendor_cost: Number(total_client_cost) }, { where: { campaign_id: campaign_id } })

        }
        if (estimate_id) {
            if (totals.buying_price_as_per_duration) {
                let update = await req.config.estimations.update({ display_buying_cost: totals.buying_price_as_per_duration }, { where: { estimate_id: estimate_id } })
            }
            if (totals.mounting_cost) {
                let update = await req.config.estimations.update({ mounting_buying_cost: totals.mounting_cost }, { where: { estimate_id: estimate_id } })
            }
            if (totals.printing_cost) {
                let update = await req.config.estimations.update({ printing_buying_cost: totals.printing_cost }, { where: { estimate_id: estimate_id } })
            }
            const total_client_cost = Number(totals.buying_price_as_per_duration) + Number(totals.mounting_cost) + Number(totals.printing_cost)
            let update = await req.config.estimations.update({ total_buying_cost: Number(total_client_cost) }, { where: { estimate_id: estimate_id } })
        }


        const estimateData = await req.config.estimations.findOne({ where: { estimate_id: estimate_id } })
        const campaignData = await req.config.mediaCampaignManagement.findOne({ where: { campaign_id: campaign_id } })

        const { total_selling_cost, total_buying_cost, display_selling_cost, display_buying_cost, printing_selling_cost, printing_buying_cost, mounting_selling_cost, mounting_buying_cost, vendor_tax, client_tax } = estimateData

        let updatedEstimate = await estimateData.update({
            overall_margin: parseFloat(Number(total_selling_cost) - Number(total_buying_cost) || 0),
            display_margin: parseFloat(Number(display_selling_cost) - Number(display_buying_cost) || 0),
            printing_margin: parseFloat(Number(printing_selling_cost) - Number(printing_buying_cost) || 0),
            mounting_margin: parseFloat(Number(mounting_selling_cost) - Number(mounting_buying_cost) || 0),
            overall_margin_percentage: parseFloat((Number(total_selling_cost) - Number(total_buying_cost)) / Number(total_selling_cost) * 100 || 0),
            display_margin_percentage: parseFloat((Number(display_selling_cost) - Number(display_buying_cost)) / Number(display_selling_cost) * 100 || 0),
            printing_margin_percentage: parseFloat((Number(printing_selling_cost) - Number(printing_buying_cost)) / Number(printing_selling_cost) * 100 || 0),
            mounting_margin_percentage: parseFloat((Number(mounting_selling_cost) - Number(mounting_buying_cost)) / Number(mounting_selling_cost) * 100 || 0),
            total_client_cost_without_tax: (Number(total_selling_cost) || 0),
            total_vendor_cost_without_tax: (Number(total_buying_cost) || 0),
            total_client_cost_with_tax: ((Number(total_selling_cost) + Number(client_tax || 0)) || 0),
            total_vendor_cost_with_tax: ((Number(total_buying_cost) + Number(vendor_tax || 0)) || 0),
        })
        let updatedCampaign = await campaignData.update({
            overall_margin: parseFloat(Number(total_selling_cost) - Number(total_buying_cost) || 0),
            display_margin: parseFloat(Number(display_selling_cost) - Number(display_buying_cost) || 0),
            printing_margin: parseFloat(Number(printing_selling_cost) - Number(printing_buying_cost) || 0),
            mounting_margin: parseFloat(Number(mounting_selling_cost) - Number(mounting_buying_cost) || 0),
            overall_margin_percentage: parseFloat((Number(total_selling_cost) - Number(total_buying_cost)) / Number(total_selling_cost) * 100 || 0),
            display_margin_percentage: parseFloat((Number(display_selling_cost) - Number(display_buying_cost)) / Number(display_selling_cost) * 100 || 0),
            printing_margin_percentage: parseFloat((Number(printing_selling_cost) - Number(printing_buying_cost)) / Number(printing_selling_cost) * 100 || 0),
            mounting_margin_percentage: parseFloat((Number(mounting_selling_cost) - Number(mounting_buying_cost)) / Number(mounting_selling_cost) * 100 || 0),
            total_client_cost_without_tax: (Number(total_selling_cost) || 0),
            total_vendor_cost_without_tax: (Number(total_buying_cost) || 0),
            total_client_cost_with_tax: ((Number(total_selling_cost) + Number(client_tax || 0)) || 0),
            total_vendor_cost_with_tax: ((Number(total_buying_cost) + Number(vendor_tax || 0)) || 0),
        })

        // const checkData = await req.config.estimationForAssetBusiness.findAll({ where: { estimate_id: estimate_id, status: true } })
        // const site_ids = checkData.map(record => record.site_id);
        // const eab_ids = checkData.map(record => record.eab_id);
        // const _vendorCostSheets = await req.config.assetVendorCostSheet.findAll({
        //     where: {
        //         site_id: { [Op.in]: site_ids },
        //         eab_id: { [Op.in]: eab_ids }
        //     }
        // })
        // if (checkData.length == _vendorCostSheets.length) {
        //     await req.config.estimations.update({ approval_status: 'NEGOTIATION COMPLETED' }, { where: { estimate_id: estimate_id } })
        // }

        return responseSuccess(req, res, "Vendor Cost Sheet Updated Successfully", updatedCostSheet);
    } catch (error) {
        logErrorToFile(error)
        console.log(error)
        return await responseError(req, res, "Something Went Wrong")
    }
};

exports.deleteAssetVendorCostSheet = async (req, res) => {
    try {
        const { vcs_id } = req.query; // Assuming the ID is provided as a Query parameter

        // Validate the record exists
        const costSheet = await req.config.assetVendorCostSheet.findOne({ where: { vcs_id: vcs_id } });
        if (!costSheet) {
            return responseError(req, res, "Cost Sheet not found.");
        }

        // Delete the record
        await costSheet.destroy();

        return responseSuccess(req, res, "Vendor Cost Sheet Deleted Successfully");
    } catch (error) {
        logErrorToFile(error)
        console.log(error)
        return await responseError(req, res, "Something Went Wrong")
    }
};

exports.getCostSheetsData = async (req, res) => {
    try {
        let data;
        const { estimate_id } = req.query;

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
            });

            // Fetch all site_ids and eab_ids
            const siteIds = data.map(record => record.site_id);
            const eabIds = data.map(record => record.eab_id);

            // Fetch client cost sheets that match the site_id and eab_id
            const vendorCostSheets = await req.config.assetVendorCostSheet.findAll({
                where: {
                    site_id: { [Op.in]: siteIds },
                    eab_id: { [Op.in]: eabIds }
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
                    { model: req.config.estimationForAssetBusiness, paranoid: false },
                    { model: req.config.mediaCampaignManagement, paranoid: false },
                    { model: req.config.printingMaterial, paranoid: false },
                    { model: req.config.accounts, as: 'printingVendor', foreignKey: 'printing_vendor_id', paranoid: false },
                    { model: req.config.accounts, as: 'mountingVendor', foreignKey: 'mounting_vendor_id', paranoid: false },
                ]
            });

            const costSheetMap = {};
            vendorCostSheets.forEach(sheet => {
                costSheetMap[`${sheet.site_id}_${sheet.eab_id}`] = sheet;
            });

            const responseData = data.map(record => {
                const key = `${record.site_id}_${record.eab_id}`;
                return costSheetMap[key] ? costSheetMap[key] : record;
            });
            const homogenizedResponse = responseData.map(item => {
                return {
                    site_id: item.site_id || null,
                    site_code: item.db_site.site_code || null,
                    vcs_id: item.vcs_id || null,
                    campaign_id: item.campaign_id || item.db_estimate.campaign_id || null,
                    eab_id: item.eab_id || null,
                    estimate_id: item.estimate_id || item?.db_estimation_asset_business?.estimate_id || null,
                    state_id: item.db_site.db_state.state_id || null,
                    state: item.db_site.db_state.state_name || null,
                    city_id: item.db_site.db_city.city_id || null,
                    city: item.db_site.db_city.city_name || null,
                    location: item.location || item.db_site.location || null,
                    category: item.category || item.db_site.db_site_category.site_cat_name || null,
                    media_format: item.media_format || item.db_site.db_media_format.m_f_name || null,
                    media_vehicle: item.media_vehicle || item.db_site.db_media_vehicle.m_v_name || null,
                    media_type: item.db_site.db_media_type.m_t_name || null,
                    m_t_id: item.db_site.db_media_type.m_t_id || null,
                    quantity: item.quantity || item.db_site.quantity || 0,
                    width: item.width || item.db_site.width || 0,
                    height: item.height || item.db_site.height || 0,
                    total_sq_ft: item.width * item.height || item.db_site.width * item.db_site.height || 0,

                    start_date: item?.start_date || item?.db_estimation_asset_business?.start_date || item.campaign_start_date || item.db_estimate.db_media_campaign.campaign_start_date || null,
                    end_date: item?.end_date || item?.db_estimation_asset_business?.end_date || item.campaign_end_date || item.db_estimate.db_media_campaign.campaign_end_date || null,
                    duration: item?.duration || item?.db_estimation_asset_business?.duration || Number(Math.floor((new Date(item?.end_date || item?.db_estimation_asset_business?.end_date) - new Date(item?.start_date || item?.db_estimation_asset_business?.start_date)) / (1000 * 60 * 60 * 24))) || Number(item.campaign_duration) || Number(Math.floor((new Date(item.campaign_end_date) - new Date(item.campaign_start_date)) / (1000 * 60 * 60 * 24))) || 0,
    
                    campaign_start_date: item.campaign_start_date || item.db_estimate.db_media_campaign.campaign_start_date || null,
                    campaign_end_date: item.campaign_end_date || item.db_estimate.db_media_campaign.campaign_end_date || null,
                    campaign_duration: Number(item.campaign_duration) || Number(Math.floor((new Date(item?.db_estimate?.db_media_campaign?.campaign_end_date) - new Date(item?.db_estimate?.db_media_campaign?.campaign_start_date)) / (1000 * 60 * 60 * 24))) || 0,

                    display_cost_per_month: item.display_cost_per_month || item.db_site.buying_cost || 0,
                    final_client_po_cost: item.final_client_po_cost || 0,
                    final_display_cost: item.final_display_cost || 0,
                    buying_price_as_per_duration: (function () {
                        const displayCost = Number(item?.display_cost_per_month) || 0;
                        const sellingCost = Number(item?.db_site?.buying_cost) || 0;
                        const price = Number(
                            displayCost / 30 *
                            (
                                Number(item?.duration || item?.db_estimation_asset_business?.duration) ||
                                Number(Math.floor((new Date(item?.end_date || item?.db_estimation_asset_business?.end_date) - new Date(item?.start_date || item?.db_estimation_asset_business?.start_date)) / (1000 * 60 * 60 * 24))) ||
                                Number(item.campaign_duration) ||
                                Number(Math.floor((new Date(item.campaign_end_date) - new Date(item.campaign_start_date)) / (1000 * 60 * 60 * 24)))))
                            ||
                            Number(
                                sellingCost / 30 * (
                                    Number(item?.duration || item?.db_estimation_asset_business?.duration) ||
                                    Number(Math.floor((new Date(item?.end_date || item?.db_estimation_asset_business?.end_date) - new Date(item?.start_date || item?.db_estimation_asset_business?.start_date)) / (1000 * 60 * 60 * 24))) ||
                                    Number(item?.db_estimate?.db_media_campaign?.campaign_duration) ||
                                    Number(Math.floor((new Date(item?.db_estimate?.db_media_campaign?.campaign_end_date) - new Date(item?.db_estimate?.db_media_campaign?.campaign_start_date)) / (1000 * 60 * 60 * 24)))));
                        return Number(price.toFixed(2)) || 0;
                    })(),
                    mounting_cost_per_sq_ft: item.mounting_cost_per_sq_ft || 0,
                    mounting_cost: item.mounting_cost || item.mounting_cost_per_sq_ft * item.total_area || 0,

                    printing_cost_per_sq_ft: item.printing_cost_per_sq_ft || 0,
                    printing_cost: item.printing_cost || item.printing_cost_per_sq_ft * item.total_area || 0,
                    remarks: item.remarks || item.db_site.remarks || null,

                    display_vendor_name: item?.db_site?.db_account?.acc_name || null,
                    display_vendor_id: item?.db_site?.db_account?.acc_id || null,

                    printing_vendor_id: item?.printingVendor?.acc_id || null,
                    printing_vendor_name: item?.printingVendor?.acc_name || null,
                    pr_m_id: item?.db_printing_material?.pr_m_id || null,
                    pr_m_name: item?.db_printing_material?.pr_m_name || null,

                    m_f_id: item?.db_site?.db_media_type?.m_f_id || null,
                    m_f_name: item?.db_site?.db_media_type?.m_f_name || null,
                    mounting_vendor_id: item?.mountingVendor?.acc_id || null,
                    mounting_vendor_name: item?.mountingVendor?.acc_name || null,
                };
            })
            const totals = {
                buying_price_as_per_duration: homogenizedResponse.reduce((acc, item) => acc + item.buying_price_as_per_duration, 0),
                mounting_cost: homogenizedResponse.reduce((acc, item) => acc + item.mounting_cost, 0),
                printing_cost: homogenizedResponse.reduce((acc, item) => acc + item.printing_cost, 0)
            };
            return await res.status(200).json({ status: 200, message: "Asset Vendor Cost Sheets Fetched Successfully", data: homogenizedResponse, totals: totals })
        }

        return await responseSuccess(req, res, "No Estimate ID Provided", []);
    } catch (error) {
        logErrorToFile(error);
        console.error(error);
        return await responseError(req, res, "Something Went Wrong");
    }
};