const { Sequelize, DataTypes, QueryTypes, where, Op } = require("sequelize");
const { responseError, responseSuccess } = require("../../../helper/responce");

exports.createAgencyVendorCostSheet = async (req, res) => {
    try {
        const { site_id, estimate_id, campaign_id, buying_price_as_per_duration, mounting_cost, printing_cost, remarks } = req.body;

        const site = await req.config.sitesForAgencyEstimates.findOne({ where: { site_id: site_id } });
        const estimate = await req.config.estimations.findOne({ where: { estimate_id: estimate_id } });
        const campaign = await req.config.mediaCampaignManagement.findOne({ where: { campaign_id: campaign_id } });

        if (!estimate_id) {
            return await responseError(req, res, "Estimate ID is required");
        }

        let data = await req.config.agencyVendorCostSheet.findOne({ where: { site_id: site_id, estimate_id: estimate_id } });

        if (data) {
            return responseError(req, res, "Agency Vendor cost sheet with this site already exists.");
        }

        const costSheet = await req.config.agencyVendorCostSheet.create(req.body);

        let dataCostSheet = await req.config.sitesForAgencyEstimates.findAll({
            where: { estimate_id: estimate_id },
            include: [
                {
                    model: req.config.estimations, paranoid: false,
                    include: [
                        { model: req.config.mediaCampaignManagement, paranoid: false }
                    ]
                },
            ]
        });

        const siteIds = dataCostSheet.map(record => record.site_id);
        const estimateIds = dataCostSheet.map(record => record.estimate_id);

        const vendorCostSheets = await req.config.agencyVendorCostSheet.findAll(
            {
                where: {
                    site_id: { [Op.in]: siteIds },
                    estimate_id: { [Op.in]: estimateIds },
                },
                include: [
                    { model: req.config.sitesForAgencyEstimates, paranoid: false },
                    { model: req.config.estimations, paranoid: false },
                    { model: req.config.mediaCampaignManagement, paranoid: false },
                    { model: req.config.printingMaterial, paranoid: false },
                    { model: req.config.accounts, as: 'printingVendorAgency', foreignKey: 'printing_vendor_id', paranoid: false },
                    { model: req.config.accounts, as: 'mountingVendorAgency', foreignKey: 'mounting_vendor_id', paranoid: false },
                ]
            }
        );

        const mappedData = dataCostSheet.map(record => {
            const costSheet = vendorCostSheets.find(sheet => sheet.site_id === record.site_id && sheet.estimate_id === record.estimate_id);
            const totalSqFt = record.width * record.height;
            return {
                vcs_id: costSheet ? costSheet.vcs_id : null,
                site_id: record.site_id,
                site_code: record.site_code,
                estimate_id: record.estimate_id,
                campaign_id: record.db_estimate?.campaign_id || null,
                state: record.state_id || null,
                city: record.city_id || null,
                location: record.location || null,
                category: null,
                media_format: record.m_f_id || null,
                media_vehicle: record.m_v_id || null,
                media_type: record.m_t_id || null,
                quantity: record.quantity || 0,
                width: record.width || 0,
                height: record.height || 0,
                total_sq_ft: totalSqFt || 0,

                start_date: record?.start_date || record.db_estimate?.db_media_campaign?.campaign_start_date || record.db_estimate.db_media_campaign.campaign_start_date || null,
                end_date: record?.end_date || record.db_estimate?.db_media_campaign?.campaign_end_date || record.db_estimate.db_media_campaign.campaign_end_date || null,
                duration: record?.duration ||
                    Number(Math.floor((new Date(record?.end_date) - new Date(record?.start_date)) / (1000 * 60 * 60 * 24))) ||
                    Number(record.db_estimate?.db_media_campaign?.campaign_duration) ||
                    Number(Math.floor((new Date(record.db_estimate?.db_media_campaign?.campaign_end_date) - new Date(record.db_estimate?.db_media_campaign?.campaign_start_date)) / (1000 * 60 * 60 * 24))) || 0,

                campaign_start_date: record.db_estimate?.db_media_campaign?.campaign_start_date || null,
                campaign_end_date: record.db_estimate?.db_media_campaign?.campaign_end_date || null,
                campaign_duration: record.db_estimate?.db_media_campaign?.campaign_duration || null,
                display_cost_per_month: record?.client_display_cost * totalSqFt || costSheet?.display_cost_per_month,
                buying_price_as_per_duration: (function () {
                    const displayCost = Number(record?.client_display_cost * totalSqFt) || 0;
                    // const price = Number(displayCost / 30 * (Number(record.db_estimate?.db_media_campaign?.campaign_duration) || Number(Math.floor((new Date(record.db_estimate?.db_media_campaign?.campaign_end_date) - new Date(record.db_estimate?.db_media_campaign?.campaign_start_date)) / (1000 * 60 * 60 * 24)))));
                    const price = Number(displayCost / 30 * (record?.duration ||
                        Number(Math.floor((new Date(record?.end_date) - new Date(record?.start_date)) / (1000 * 60 * 60 * 24))) ||
                        Number(record.db_estimate?.db_media_campaign?.campaign_duration) ||
                        Number(Math.floor((new Date(record.db_estimate?.db_media_campaign?.campaign_end_date) - new Date(record.db_estimate?.db_media_campaign?.campaign_start_date)) / (1000 * 60 * 60 * 24))) || 0));
                    return Number(price.toFixed(2));
                })(),
                _client_po_cost: record?._client_po_cost || (function () {
                    const displayCost = Number(record?.client_display_cost * totalSqFt) || 0;
                    const price = Number(displayCost / 30 * (record?.duration ||
                        Number(Math.floor((new Date(record?.end_date) - new Date(record?.start_date)) / (1000 * 60 * 60 * 24))) ||
                        Number(record.db_estimate?.db_media_campaign?.campaign_duration) ||
                        Number(Math.floor((new Date(record.db_estimate?.db_media_campaign?.campaign_end_date) - new Date(record.db_estimate?.db_media_campaign?.campaign_start_date)) / (1000 * 60 * 60 * 24))) || 0));
                    return Number(price.toFixed(2));
                })() + Number(record?.client_mounting_cost * totalSqFt || 0) + Number(record?.client_printing_cost * totalSqFt || 0) || null,

                display_vendor_name: costSheet?.db_site?.db_account?.acc_name || null,

                printing_cost_per_sq_ft: record?.client_printing_cost || 0,
                printing_cost: record?.client_printing_cost * totalSqFt || 0,
                printing_vendor_id: costSheet?.printingVendorAgency?.acc_id || null,
                printing_vendor_name: costSheet?.printingVendorAgency?.acc_name || null,

                pr_m_id: costSheet?.db_printing_material?.pr_m_id || null,
                pr_m_name: costSheet?.db_printing_material?.pr_m_name || null,

                mounting_cost_per_sq_ft: record?.client_mounting_cost || 0,
                mounting_cost: record?.client_mounting_cost * totalSqFt || 0,
                mounting_vendor_id: costSheet?.mountingVendorAgency?.acc_id || null,
                mounting_vendor_name: costSheet?.mountingVendorAgency?.acc_name || null,

                remarks: costSheet?.remarks || ""
            };
        });
        const totals = {
            buying_price_as_per_duration: mappedData.reduce((acc, item) => acc + item.buying_price_as_per_duration, 0),
            mounting_cost: mappedData.reduce((acc, item) => acc + item.mounting_cost, 0),
            printing_cost: mappedData.reduce((acc, item) => acc + item.printing_cost, 0)
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

        // const checkData = await req.config.sitesForAgencyEstimates.findAll({ where: { estimate_id: estimate_id }, })
        // const site_Ids = checkData.map(record => record.site_id);
        // const estimate_Ids = checkData.map(record => record.estimate_id);
        // const _vendorCostSheets = await req.config.agencyVendorCostSheet.findAll({
        //     where: {
        //         site_id: { [Op.in]: site_Ids },
        //         estimate_id: { [Op.in]: estimate_Ids },
        //     }
        // })

        // if (checkData.length == _vendorCostSheets.length) {
        //     await req.config.estimations.update({ approval_status: 'NEGOTIATION COMPLETED' }, { where: { estimate_id: estimate_id } })
        // }

        return responseSuccess(req, res, "Agency Vendor Cost Sheet Created Successfully", costSheet);
    } catch (error) {
        logErrorToFile(error)
        console.log(error)
        return await responseError(req, res, "Something Went Wrong")
    }
};

exports.getAgencyVendorCostSheet = async (req, res) => {
    try {
        const { vcs_id, site_id, estimate_id } = req.query;

        let data;
        if (vcs_id && vcs_id !== null && vcs_id !== "") {
            data = await req.config.agencyVendorCostSheet.findOne(
                {
                    where: { vcs_id: vcs_id },
                    include: [
                        { model: req.config.sitesForAgencyEstimates, paranoid: false },
                        { model: req.config.estimations, paranoid: false },
                        { model: req.config.mediaCampaignManagement, paranoid: false },
                        // { model: req.config.accounts, as: 'printingVendorAgency', foreignKey: 'printing_vendor_id', paranoid: false },
                        // { model: req.config.accounts, as: 'mountingVendorAgency', foreignKey: 'mounting_vendor_id', paranoid: false },
                    ]
                }
            );
        }
        if (site_id && site_id !== null && site_id !== "") {
            data = await req.config.agencyVendorCostSheet.findOne(
                {
                    where: { site_id: site_id, estimate_id: estimate_id },
                    include: [
                        { model: req.config.sitesForAgencyEstimates, paranoid: false },
                        { model: req.config.estimations, paranoid: false },
                        { model: req.config.printingMaterial, paranoid: false },
                        { model: req.config.mediaCampaignManagement, paranoid: false },
                        { model: req.config.accounts, as: 'printingVendorAgency', foreignKey: 'printing_vendor_id', paranoid: false },
                        { model: req.config.accounts, as: 'mountingVendorAgency', foreignKey: 'mounting_vendor_id', paranoid: false },
                    ]
                }
            );
        }
        else {
            data = await req.config.agencyVendorCostSheet.findAll();
        }

        return responseSuccess(req, res, "Agency Vendor Cost Sheet Fetched Successfully", data);
    } catch (error) {
        logErrorToFile(error)
        console.log(error)
        return await responseError(req, res, "Something Went Wrong")
    }
};

exports.updateAgencyVendorCostSheet = async (req, res) => {
    try {
        const { vcs_id, site_id, estimate_id, campaign_id, mounting_vendor_id, buying_price_as_per_duration, mounting_cost, printing_cost, mounting_cost_per_sq_ft, printing_vendor_id, pr_m_id, printing_cost_per_sq_ft, final_display_cost, remarks } = req.body;

        const site = await req.config.sitesForAgencyEstimates.findOne({ where: { site_id: site_id } });
        const estimate = await req.config.estimations.findOne({ where: { estimate_id: estimate_id } });
        const campaign = await req.config.mediaCampaignManagement.findOne({ where: { campaign_id: campaign_id } });

        const costSheet = await req.config.agencyVendorCostSheet.findOne({ where: { vcs_id: vcs_id } });
        const updatedCostSheet = await costSheet.update(req.body);


        if (!estimate_id) {
            return await responseError(req, res, "Estimate ID is required");
        }

        let dataCostSheet = await req.config.sitesForAgencyEstimates.findAll({
            where: { estimate_id: estimate_id },
            include: [
                {
                    model: req.config.estimations, paranoid: false,
                    include: [
                        { model: req.config.mediaCampaignManagement, paranoid: false }
                    ]
                },
            ]
        });

        const siteIds = dataCostSheet.map(record => record.site_id);
        const estimateIds = dataCostSheet.map(record => record.estimate_id);

        const vendorCostSheets = await req.config.agencyVendorCostSheet.findAll(
            {
                where: {
                    site_id: { [Op.in]: siteIds },
                    estimate_id: { [Op.in]: estimateIds },
                },
                include: [
                    { model: req.config.sitesForAgencyEstimates, paranoid: false },
                    { model: req.config.estimations, paranoid: false },
                    { model: req.config.mediaCampaignManagement, paranoid: false },
                    { model: req.config.printingMaterial, paranoid: false },
                    { model: req.config.accounts, as: 'printingVendorAgency', foreignKey: 'printing_vendor_id', paranoid: false },
                    { model: req.config.accounts, as: 'mountingVendorAgency', foreignKey: 'mounting_vendor_id', paranoid: false },
                ]
            }
        );

        const mappedData = dataCostSheet.map(record => {
            const costSheet = vendorCostSheets.find(sheet => sheet.site_id === record.site_id && sheet.estimate_id === record.estimate_id);
            const totalSqFt = record.width * record.height;
            return {
                vcs_id: costSheet ? costSheet.vcs_id : null,
                site_id: record.site_id,
                site_code: record.site_code,
                estimate_id: record.estimate_id,
                campaign_id: record.db_estimate?.campaign_id || null,
                state: record.state_id || null,
                city: record.city_id || null,
                location: record.location || null,
                category: null,
                media_format: record.m_f_id || null,
                media_vehicle: record.m_v_id || null,
                media_type: record.m_t_id || null,
                quantity: record.quantity || 0,
                width: record.width || 0,
                height: record.height || 0,
                total_sq_ft: totalSqFt || 0,

                start_date: record?.start_date || record.db_estimate?.db_media_campaign?.campaign_start_date || record.db_estimate.db_media_campaign.campaign_start_date || null,
                end_date: record?.end_date || record.db_estimate?.db_media_campaign?.campaign_end_date || record.db_estimate.db_media_campaign.campaign_end_date || null,
                duration: record?.duration ||
                    Number(Math.floor((new Date(record?.end_date) - new Date(record?.start_date)) / (1000 * 60 * 60 * 24))) ||
                    Number(record.db_estimate?.db_media_campaign?.campaign_duration) ||
                    Number(Math.floor((new Date(record.db_estimate?.db_media_campaign?.campaign_end_date) - new Date(record.db_estimate?.db_media_campaign?.campaign_start_date)) / (1000 * 60 * 60 * 24))) || 0,

                campaign_start_date: record.db_estimate?.db_media_campaign?.campaign_start_date || null,
                campaign_end_date: record.db_estimate?.db_media_campaign?.campaign_end_date || null,
                campaign_duration: record.db_estimate?.db_media_campaign?.campaign_duration || null,

                display_cost_per_month: record?.client_display_cost * totalSqFt || costSheet?.display_cost_per_month,
                buying_price_as_per_duration: costSheet?.selling_price_as_per_duration || (function () {
                    const displayCost = Number(record?.client_display_cost * totalSqFt) || 0;
                    const price = Number(displayCost / 30 * (record?.duration ||
                        Number(Math.floor((new Date(record?.end_date) - new Date(record?.start_date)) / (1000 * 60 * 60 * 24))) ||
                        Number(record.db_estimate?.db_media_campaign?.campaign_duration) ||
                        Number(Math.floor((new Date(record.db_estimate?.db_media_campaign?.campaign_end_date) - new Date(record.db_estimate?.db_media_campaign?.campaign_start_date)) / (1000 * 60 * 60 * 24))) || 0));
                    return Number(price.toFixed(2));
                })(),
                _client_po_cost: record?._client_po_cost || (function () {
                    const displayCost = Number(record?.client_display_cost * totalSqFt) || 0;
                    const price = Number(displayCost / 30 * (record?.duration ||
                        Number(Math.floor((new Date(record?.end_date) - new Date(record?.start_date)) / (1000 * 60 * 60 * 24))) ||
                        Number(record.db_estimate?.db_media_campaign?.campaign_duration) ||
                        Number(Math.floor((new Date(record.db_estimate?.db_media_campaign?.campaign_end_date) - new Date(record.db_estimate?.db_media_campaign?.campaign_start_date)) / (1000 * 60 * 60 * 24))) || 0));
                    return Number(price.toFixed(2));
                })() + Number(record?.client_mounting_cost * totalSqFt || 0) + Number(record?.client_printing_cost * totalSqFt || 0) || null,

                display_vendor_name: costSheet?.db_site?.db_account?.acc_name || null,

                printing_cost_per_sq_ft: record?.client_printing_cost || 0,
                printing_cost: record?.client_printing_cost * totalSqFt || 0,
                printing_vendor_id: costSheet?.printingVendorAgency?.acc_id || null,
                printing_vendor_name: costSheet?.printingVendorAgency?.acc_name || null,

                pr_m_id: costSheet?.db_printing_material?.pr_m_id || null,
                pr_m_name: costSheet?.db_printing_material?.pr_m_name || null,

                mounting_cost_per_sq_ft: costSheet?.mounting_cost_per_sq_ft || record?.client_mounting_cost || 0,
                mounting_cost: costSheet?.mounting_cost || record?.client_mounting_cost * totalSqFt || 0,
                printing_cost_per_sq_ft: costSheet?.printing_cost_per_sq_ft || record?.client_printing_cost || 0,
                printing_cost: costSheet?.printing_cost || record?.client_printing_cost * totalSqFt || 0,

                remarks: costSheet?.remarks || ""
            };
        });
        const totals = {
            buying_price_as_per_duration: mappedData.reduce((acc, item) => acc + item.buying_price_as_per_duration, 0),
            mounting_cost: mappedData.reduce((acc, item) => acc + item.mounting_cost, 0),
            printing_cost: mappedData.reduce((acc, item) => acc + item.printing_cost, 0)
        };

        if (!costSheet) {
            return responseError(req, res, "Cost Sheet not found.");
        }

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
            if (buying_price_as_per_duration) {
                let update = await req.config.mediaCampaignManagement.update({ total_vendor_display_cost: totals.buying_price_as_per_duration }, { where: { campaign_id: campaign_id } })
            }
            if (mounting_cost) {
                let update = await req.config.mediaCampaignManagement.update({ total_vendor_mounting_cost: totals.mounting_cost }, { where: { campaign_id: campaign_id } })
            }
            if (printing_cost) {
                let update = await req.config.mediaCampaignManagement.update({ total_vendor_printing_cost: totals.printing_cost }, { where: { campaign_id: campaign_id } })
            }
            const total_client_cost = Number(totals.buying_price_as_per_duration) + Number(totals.mounting_cost) + Number(totals.printing_cost)
            let update = await req.config.mediaCampaignManagement.update({ total_vendor_cost: Number(total_client_cost) }, { where: { campaign_id: campaign_id } })

        }
        if (estimate_id) {
            if (buying_price_as_per_duration) {
                let update = await req.config.estimations.update({ display_buying_cost: totals.buying_price_as_per_duration }, { where: { estimate_id: estimate_id } })
            }
            if (mounting_cost) {
                let update = await req.config.estimations.update({ mounting_buying_cost: totals.mounting_cost }, { where: { estimate_id: estimate_id } })
            }
            if (printing_cost) {
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
        // const checkData = await req.config.sitesForAgencyEstimates.findAll({ where: { estimate_id: estimate_id }, })
        // const site_ids = checkData.map(record => record.site_id);
        // const estimate_ids = checkData.map(record => record.estimate_id);
        // const _vendorCostSheets = await req.config.agencyVendorCostSheet.findAll({
        //     where: {
        //         site_id: { [Op.in]: site_ids },
        //         estimate_id: { [Op.in]: estimate_ids },
        //     }
        // })

        // if (checkData.length == _vendorCostSheets.length) {
        //     await req.config.estimations.update({ approval_status: 'NEGOTIATION COMPLETED' }, { where: { estimate_id: estimate_id } })
        // }

        return responseSuccess(req, res, "Agency Vendor Cost Sheet Updated Successfully", updatedCostSheet);
    } catch (error) {
        logErrorToFile(error)
        console.log(error)
        return await responseError(req, res, "Something Went Wrong")
    }
};

exports.deleteAgencyVendorCostSheet = async (req, res) => {
    try {
        const { vcs_id } = req.query; // Assuming the ID is provided as a URL parameter

        // Validate the record exists
        const costSheet = await req.config.agencyVendorCostSheet.findOne({ where: { vcs_id: vcs_id } });
        if (!costSheet) {
            return responseError(req, res, "Cost Sheet not found.");
        }

        // Delete the record
        await costSheet.destroy();

        return responseSuccess(req, res, "Agency Vendor Cost Sheet Deleted Successfully");
    } catch (error) {
        logErrorToFile(error)
        console.log(error)
        return await responseError(req, res, "Something Went Wrong")
    }
};

exports.getAgencyCostSheetsData = async (req, res) => {
    try {
        const { estimate_id } = req.query;

        if (!estimate_id || estimate_id == 'null' || estimate_id == '') {
            return await responseError(req, res, "Estimate ID is required");
        }

        let dataCostSheet = await req.config.sitesForAgencyEstimates.findAll({
            where: { estimate_id: estimate_id },
            include: [
                {
                    model: req.config.estimations, paranoid: false,
                    include: [
                        { model: req.config.mediaCampaignManagement, paranoid: false }
                    ]
                },
            ]
        });

        const siteIds = dataCostSheet.map(record => record.site_id);
        const estimateIds = dataCostSheet.map(record => record.estimate_id);

        const vendorCostSheets = await req.config.agencyVendorCostSheet.findAll(
            {
                where: {
                    site_id: { [Op.in]: siteIds },
                    estimate_id: { [Op.in]: estimateIds },
                },
                include: [
                    { model: req.config.sitesForAgencyEstimates, paranoid: false },
                    { model: req.config.estimations, paranoid: false },
                    { model: req.config.mediaCampaignManagement, paranoid: false },
                    { model: req.config.printingMaterial, paranoid: false },
                    { model: req.config.accounts, as: 'printingVendorAgency', foreignKey: 'printing_vendor_id', paranoid: false },
                    { model: req.config.accounts, as: 'mountingVendorAgency', foreignKey: 'mounting_vendor_id', paranoid: false },
                ]
            }
        );

        const mappedData = dataCostSheet.map(record => {
            const costSheet = vendorCostSheets.find(sheet => sheet.site_id === record.site_id && sheet.estimate_id === record.estimate_id);
            const totalSqFt = record.width * record.height;
            return {
                vcs_id: costSheet ? costSheet.vcs_id : null,
                site_id: record.site_id,
                site_code: record.site_code,
                estimate_id: record.estimate_id,
                campaign_id: record.db_estimate?.campaign_id || null,
                state: record.state_id || null,
                city: record.city_id || null,
                location: record.location || null,
                category: null,
                media_format: record.m_f_id || null,
                media_vehicle: record.m_v_id || null,
                media_type: record.m_t_id || null,
                quantity: record.quantity || 0,
                width: record.width || 0,
                height: record.height || 0,
                total_sq_ft: totalSqFt || 0,

                start_date: record?.start_date || record.db_estimate?.db_media_campaign?.campaign_start_date || record.db_estimate.db_media_campaign.campaign_start_date || null,
                end_date: record?.end_date || record.db_estimate?.db_media_campaign?.campaign_end_date || record.db_estimate.db_media_campaign.campaign_end_date || null,
                duration: record?.duration ||
                    Number(Math.floor((new Date(record?.end_date) - new Date(record?.start_date)) / (1000 * 60 * 60 * 24))) ||
                    Number(record.db_estimate?.db_media_campaign?.campaign_duration) ||
                    Number(Math.floor((new Date(record.db_estimate?.db_media_campaign?.campaign_end_date) - new Date(record.db_estimate?.db_media_campaign?.campaign_start_date)) / (1000 * 60 * 60 * 24))) || 0,

                campaign_start_date: record.db_estimate?.db_media_campaign?.campaign_start_date || null,
                campaign_end_date: record.db_estimate?.db_media_campaign?.campaign_end_date || null,
                campaign_duration: record.db_estimate?.db_media_campaign?.campaign_duration || null,

                display_cost_per_month: record?.client_display_cost * totalSqFt || costSheet?.display_cost_per_month,
                buying_price_as_per_duration: (function () {
                    const displayCost = Number(record?.client_display_cost * totalSqFt) || 0;
                    const price = Number(displayCost / 30 * (record?.duration ||
                        Number(Math.floor((new Date(record?.end_date) - new Date(record?.start_date)) / (1000 * 60 * 60 * 24))) ||
                        Number(record.db_estimate?.db_media_campaign?.campaign_duration) ||
                        Number(Math.floor((new Date(record.db_estimate?.db_media_campaign?.campaign_end_date) - new Date(record.db_estimate?.db_media_campaign?.campaign_start_date)) / (1000 * 60 * 60 * 24))) || 0));
                    return Number(price.toFixed(2));
                })(),
                _client_po_cost: record?._client_po_cost || (function () {
                    const displayCost = Number(record?.client_display_cost * totalSqFt) || 0;
                    // const price = Number(displayCost / 30 * (Number(record.db_estimate?.db_media_campaign?.campaign_duration) || Number(Math.floor((new Date(record.db_estimate?.db_media_campaign?.campaign_end_date) - new Date(record.db_estimate?.db_media_campaign?.campaign_start_date)) / (1000 * 60 * 60 * 24)))));
                    // return Number(price.toFixed(2));
                    const price = Number(displayCost / 30 * (record?.duration ||
                        Number(Math.floor((new Date(record?.end_date) - new Date(record?.start_date)) / (1000 * 60 * 60 * 24))) ||
                        Number(record.db_estimate?.db_media_campaign?.campaign_duration) ||
                        Number(Math.floor((new Date(record.db_estimate?.db_media_campaign?.campaign_end_date) - new Date(record.db_estimate?.db_media_campaign?.campaign_start_date)) / (1000 * 60 * 60 * 24))) || 0));
                    return Number(price.toFixed(2));
                })() + Number(record?.client_mounting_cost * totalSqFt || 0) + Number(record?.client_printing_cost * totalSqFt || 0) || null,

                display_vendor_name: costSheet?.db_site?.db_account?.acc_name || null,

                printing_cost_per_sq_ft: record?.client_printing_cost || 0,
                printing_cost: record?.client_printing_cost * totalSqFt || 0,
                printing_vendor_id: costSheet?.printingVendorAgency?.acc_id || null,
                printing_vendor_name: costSheet?.printingVendorAgency?.acc_name || null,

                display_vendor_id: costSheet?.displayVendorAgency?.acc_id || null,
                display_vendor_name: costSheet?.displayVendorAgency?.acc_name || null,

                pr_m_id: costSheet?.db_printing_material?.pr_m_id || null,
                pr_m_name: costSheet?.db_printing_material?.pr_m_name || null,

                mounting_cost_per_sq_ft: costSheet?.mounting_cost_per_sq_ft || record?.client_mounting_cost || 0,
                mounting_cost: costSheet?.mounting_cost || record?.client_mounting_cost * totalSqFt || 0,
                printing_cost_per_sq_ft: costSheet?.printing_cost_per_sq_ft || record?.client_printing_cost || 0,
                printing_cost: costSheet?.printing_cost || record?.client_printing_cost * totalSqFt || 0,

                remarks: costSheet?.remarks || ""
            };
        });
        const totals = {
            buying_price_as_per_duration: mappedData.reduce((acc, item) => acc + item.buying_price_as_per_duration, 0),
            mounting_cost: mappedData.reduce((acc, item) => acc + item.mounting_cost, 0),
            printing_cost: mappedData.reduce((acc, item) => acc + item.printing_cost, 0)
        };
        return await res.status(200).json({ status: 200, message: "Agency Cost Sheets Fetched Successfully", data: mappedData, totals: totals })
    } catch (error) {
        console.error(error);
        return await responseError(req, res, "Something Went Wrong");
    }
};