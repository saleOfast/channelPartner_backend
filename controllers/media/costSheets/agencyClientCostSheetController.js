const { Sequelize, DataTypes, QueryTypes, where, Op } = require("sequelize");
const { responseError, responseSuccess } = require("../../../helper/responce");

exports.createAgencyCostSheet = async (req, res) => {
    try {
        const { site_id, estimate_id, campaign_id, mounting_cost_per_sq_ft, display_cost_per_month, total_sq_ft, printing_cost_per_sq_ft, quantity, width, height, campaign_start_date, campaign_end_date, campaign_duration, selling_price_as_per_duration, mounting_cost, printing_cost, client_display_cost, client_mounting_cost, client_printing_cost, remarks } = req.body;
        let body = req.body

        if (!estimate_id) {
            return await responseError(req, res, "Estimate ID is required");
        }

        const site = await req.config.sitesForAgencyEstimates.findOne({ where: { site_id: site_id } });
        const estimate = await req.config.estimations.findOne({ where: { estimate_id: estimate_id } });
        const campaign = await req.config.mediaCampaignManagement.findOne({ where: { campaign_id: campaign_id } });

        if (!site) {
            return responseError(req, res, "Invalid site id.");
        }
        if (!estimate) {
            return responseError(req, res, "Invalid estimate id.");
        }
        if (!campaign) {
            return responseError(req, res, "Invalid campaign id.");
        }

        const costSheet = await req.config.agencyClientCostSheet.create(body);

        let data = await req.config.sitesForAgencyEstimates.findAll({
            where: { estimate_id },
            include: [
                {
                    model: req.config.estimations, paranoid: false,
                    include: [
                        { model: req.config.mediaCampaignManagement, paranoid: false }
                    ]
                },
            ]
        });

        const siteIds = data.map(record => record.site_id);
        const estimateIds = data.map(record => record.estimate_id);

        const clientCostSheets = await req.config.agencyClientCostSheet.findAll({
            where: {
                site_id: { [Op.in]: siteIds },
                estimate_id: { [Op.in]: estimateIds },
            },
        });

        const mappedData = data.map(record => {
            const costSheet = clientCostSheets.find(sheet => sheet.site_id === record.site_id && sheet.estimate_id === record.estimate_id);
            const totalSqFt = record.width * record.height;
            return {
                ccs_id: costSheet ? costSheet.ccs_id : null,
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
                selling_price_as_per_duration: (function () {
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
                mounting_cost_per_sq_ft: record?.client_mounting_cost || 0,
                mounting_cost: record?.client_mounting_cost * totalSqFt || 0,
                printing_cost_per_sq_ft: record?.client_printing_cost || 0,
                printing_cost: record?.client_printing_cost * totalSqFt || 0,
                remarks: costSheet?.remarks || ""
            };
        });

        const totals = {
            selling_price_as_per_duration: mappedData.reduce((acc, item) => acc + item.selling_price_as_per_duration, 0),
            mounting_cost: mappedData.reduce((acc, item) => acc + item.mounting_cost, 0),
            printing_cost: mappedData.reduce((acc, item) => acc + item.printing_cost, 0)
        };


        if (site_id) {
            if (width) {
                let update = await req.config.sitesForAgencyEstimates.update({ width: width }, { where: { site_id: site_id } })
            }
            if (quantity) {
                let update = await req.config.sitesForAgencyEstimates.update({ quantity: quantity }, { where: { site_id: site_id } })
            }
            if (height) {
                let update = await req.config.sitesForAgencyEstimates.update({ height: height }, { where: { site_id: site_id } })
            }
            if (selling_price_as_per_duration) {
                let update = await req.config.sitesForAgencyEstimates.update({ client_display_cost: Number(display_cost_per_month) / Number(total_sq_ft) }, { where: { site_id: site_id } })
            }
            if (mounting_cost) {
                let update = await req.config.sitesForAgencyEstimates.update({ client_mounting_cost: Number(mounting_cost_per_sq_ft) }, { where: { site_id: site_id } })
            }
            if (printing_cost) {
                let update = await req.config.sitesForAgencyEstimates.update({ client_printing_cost: Number(printing_cost_per_sq_ft) }, { where: { site_id: site_id } })
            }
        }
        if (campaign_id) {
            if (campaign_start_date) {
                let update = await req.config.mediaCampaignManagement.update({ campaign_start_date: campaign_start_date }, { where: { campaign_id: campaign_id } })
            }
            if (campaign_end_date) {
                let update = await req.config.mediaCampaignManagement.update({ campaign_end_date: campaign_end_date }, { where: { campaign_id: campaign_id } })
            }
            if (campaign_duration) {
                let update = await req.config.mediaCampaignManagement.update({ campaign_duration: campaign_duration }, { where: { campaign_id: campaign_id } })
            }
            if (totals.selling_price_as_per_duration) {
                let update = await req.config.mediaCampaignManagement.update({ client_display_cost: totals.selling_price_as_per_duration }, { where: { campaign_id: campaign_id } })
            }
            if (totals.mounting_cost) {
                let update = await req.config.mediaCampaignManagement.update({ client_mounting_cost: totals.mounting_cost }, { where: { campaign_id: campaign_id } })
            }
            if (totals.printing_cost) {
                let update = await req.config.mediaCampaignManagement.update({ client_printing_cost: totals.printing_cost }, { where: { campaign_id: campaign_id } })
            }
            const total_client_cost = Number(totals.selling_price_as_per_duration) + Number(totals.mounting_cost) + Number(totals.printing_cost)
            let update = await req.config.mediaCampaignManagement.update({ total_client_cost: Number(total_client_cost) }, { where: { campaign_id: campaign_id } })

        }
        if (estimate_id) {
            if (totals.selling_price_as_per_duration) {
                let update = await req.config.estimations.update({ display_selling_cost: totals.selling_price_as_per_duration }, { where: { estimate_id: estimate_id } })
            }
            if (totals.mounting_cost) {
                let update = await req.config.estimations.update({ mounting_selling_cost: totals.mounting_cost }, { where: { estimate_id: estimate_id } })
            }
            if (totals.printing_cost) {
                let update = await req.config.estimations.update({ printing_selling_cost: totals.printing_cost }, { where: { estimate_id: estimate_id } })
            }
            const total_client_cost = Number(totals.selling_price_as_per_duration) + Number(totals.mounting_cost) + Number(totals.printing_cost)
            let update = await req.config.estimations.update({ total_selling_cost: Number(total_client_cost) }, { where: { estimate_id: estimate_id } })
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
        return responseSuccess(req, res, "Client Cost Sheet Created Successfully", costSheet);
    } catch (error) {
        logErrorToFile(error)
        console.log(error)
        return await responseError(req, res, "Something Went Wrong")
    }

}

exports.getAgencyCostSheet = async (req, res) => {
    try {
        let data
        const { ccs_id, site_id, estimate_id } = req.query

        if (ccs_id && ccs_id != null && ccs_id != "") {
            data = await req.config.agencyClientCostSheet.findOne(
                {
                    where: { ccs_id: ccs_id },
                    include: [
                        { model: req.config.sitesForAgencyEstimates, paranoid: false },
                        { model: req.config.estimations, paranoid: false },
                        { model: req.config.mediaCampaignManagement, paranoid: false },

                    ]
                }
            )
        }
        if (site_id && site_id != null && site_id != "") {
            data = await req.config.agencyClientCostSheet.findOne(
                {
                    where: { site_id: site_id, estimate_id: estimate_id },
                    include: [
                        { model: req.config.sitesForAgencyEstimates, paranoid: false },
                        { model: req.config.estimations, paranoid: false },
                        { model: req.config.mediaCampaignManagement, paranoid: false },
                    ]
                }
            )
        }
        else if (estimate_id && estimate_id != null && estimate_id != "") {
            data = await req.config.agencyClientCostSheet.findAll({
                where: { estimate_id: estimate_id }
            })
        }
        else {
            data = await req.config.agencyClientCostSheet.findAll()
        }
        return await responseSuccess(req, res, "Agency Cost Sheets Fetched Succesfully", data)

    } catch (error) {
        logErrorToFile(error)
        console.log(error)
        return await responseError(req, res, "Something Went Wrong")
    }
}

exports.updateAgencyCostSheet = async (req, res) => {
    try {
        const { ccs_id, site_id, estimate_id, campaign_id, quantity, width, height, campaign_start_date, campaign_end_date, campaign_duration, selling_price_as_per_duration, mounting_cost, printing_cost, printing_cost_per_sq_ft, mounting_cost_per_sq_ft, display_cost_per_month, total_sq_ft, remarks } = req.body;
        let site, estimate, campaign

        if (!estimate_id) {
            return await responseError(req, res, "Estimate ID is required");
        }

        const costSheet = await req.config.agencyClientCostSheet.findOne({ where: { ccs_id: ccs_id } });

        if (!costSheet) {
            return responseError(req, res, "Cost Sheet not found.");
        }

        if (site_id) {
            site = await req.config.sitesForAgencyEstimates.findOne({ where: { site_id: site_id } });
        }
        if (estimate_id) {
            estimate = await req.config.estimations.findOne({ where: { estimate_id: estimate_id } });
        }
        if (campaign_id) {
            campaign = await req.config.mediaCampaignManagement.findOne({ where: { campaign_id: campaign_id } });
        }

        if (!site) {
            return responseError(req, res, "Invalid site ccs_id.");
        }
        if (!estimate) {
            return responseError(req, res, "Invalid estimate ccs_id.");
        }
        if (!campaign) {
            return responseError(req, res, "Invalid campaign ccs_id.");
        }

        const updatedCostSheet = await costSheet.update(req.body);

        let data = await req.config.sitesForAgencyEstimates.findAll({
            where: { estimate_id },
            include: [
                {
                    model: req.config.estimations, paranoid: false,
                    include: [
                        { model: req.config.mediaCampaignManagement, paranoid: false }
                    ]
                },
            ]
        });

        const siteIds = data.map(record => record.site_id);
        const estimateIds = data.map(record => record.estimate_id);

        const clientCostSheets = await req.config.agencyClientCostSheet.findAll({
            where: {
                site_id: { [Op.in]: siteIds },
                estimate_id: { [Op.in]: estimateIds },
            },
        });

        const mappedData = data.map(record => {
            const costSheet = clientCostSheets.find(sheet => sheet.site_id === record.site_id && sheet.estimate_id === record.estimate_id);
            const totalSqFt = record.width * record.height;
            return {
                ccs_id: costSheet ? costSheet.ccs_id : null,
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
                selling_price_as_per_duration: costSheet?.selling_price_as_per_duration || (function () {
                    const displayCost = Number(record?.client_display_cost * totalSqFt) || 0;
                    // const price = Number(displayCost / 30 * 
                    //     (Number(record.db_estimate?.db_media_campaign?.campaign_duration) || Number(Math.floor((new Date(record.db_estimate?.db_media_campaign?.campaign_end_date) - new Date(record.db_estimate?.db_media_campaign?.campaign_start_date)) / (1000 * 60 * 60 * 24)))));
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
                mounting_cost_per_sq_ft: costSheet?.mounting_cost_per_sq_ft || record?.client_mounting_cost || 0,
                mounting_cost: costSheet?.mounting_cost || record?.client_mounting_cost * totalSqFt || 0,
                printing_cost_per_sq_ft: costSheet?.printing_cost_per_sq_ft || record?.client_printing_cost || 0,
                printing_cost: costSheet?.printing_cost || record?.client_printing_cost * totalSqFt || 0,
                remarks: costSheet?.remarks || ""
            };
        });

        const totals = {
            selling_price_as_per_duration: mappedData.reduce((acc, item) => acc + item.selling_price_as_per_duration, 0),
            mounting_cost: mappedData.reduce((acc, item) => acc + item.mounting_cost, 0),
            printing_cost: mappedData.reduce((acc, item) => acc + item.printing_cost, 0)
        };

        const oldValues = costSheet.get({ plain: true });

        const differences = {};
        const fieldsToCompare = ['site_id', 'estimate_id', 'campaign_id', 'quantity', 'width', 'height', 'final_client_po_cost', 'mounting_cost_per_sq_ft', 'printing_cost_per_sq_ft', 'campaign_start_date', 'campaign_end_date', 'remarks'];
        fieldsToCompare.forEach(field => {
            if (oldValues[field] !== req.body[field]) {
                differences[field] = {
                    old_value: oldValues[field],
                    new_value: req.body[field]
                };
            }
        });

        if (site_id) {
            if (width) {
                let update = await req.config.sitesForAgencyEstimates.update({ width: width }, { where: { site_id: site_id } })
            }
            if (quantity) {
                let update = await req.config.sitesForAgencyEstimates.update({ quantity: quantity }, { where: { site_id: site_id } })
            }
            if (height) {
                let update = await req.config.sitesForAgencyEstimates.update({ height: height }, { where: { site_id: site_id } })
            }
            if (selling_price_as_per_duration) {
                let update = await req.config.sitesForAgencyEstimates.update({ client_display_cost: display_cost_per_month / total_sq_ft }, { where: { site_id: site_id } })
            }
            if (mounting_cost) {
                let update = await req.config.sitesForAgencyEstimates.update({ client_mounting_cost: mounting_cost_per_sq_ft }, { where: { site_id: site_id } })
            }
            if (printing_cost) {
                let update = await req.config.sitesForAgencyEstimates.update({ client_printing_cost: printing_cost_per_sq_ft }, { where: { site_id: site_id } })
            }
        }
        if (campaign_id) {
            if (campaign_start_date) {
                let update = await req.config.mediaCampaignManagement.update({ campaign_start_date: campaign_start_date }, { where: { campaign_id: campaign_id } })
            }
            if (campaign_end_date) {
                let update = await req.config.mediaCampaignManagement.update({ campaign_end_date: campaign_end_date }, { where: { campaign_id: campaign_id } })
            }
            if (campaign_duration) {
                let update = await req.config.mediaCampaignManagement.update({ campaign_duration: campaign_duration }, { where: { campaign_id: campaign_id } })
            }
            if (totals.selling_price_as_per_duration) {
                let update = await req.config.mediaCampaignManagement.update({ client_display_cost: totals.selling_price_as_per_duration }, { where: { campaign_id: campaign_id } })
            }
            if (totals.mounting_cost) {
                let update = await req.config.mediaCampaignManagement.update({ client_mounting_cost: totals.mounting_cost }, { where: { campaign_id: campaign_id } })
            }
            if (totals.printing_cost) {
                let update = await req.config.mediaCampaignManagement.update({ client_printing_cost: totals.printing_cost }, { where: { campaign_id: campaign_id } })
            }

            const total_client_cost = Number(totals.selling_price_as_per_duration) + Number(totals.mounting_cost) + Number(totals.printing_cost)
            let update = await req.config.mediaCampaignManagement.update({ total_client_cost: Number(total_client_cost) }, { where: { campaign_id: campaign_id } })
        }
        if (estimate_id) {
            if (totals.selling_price_as_per_duration) {
                let update = await req.config.estimations.update({ display_selling_cost: totals.selling_price_as_per_duration }, { where: { estimate_id: estimate_id } })
            }
            if (totals.mounting_cost) {
                let update = await req.config.estimations.update({ mounting_selling_cost: totals.mounting_cost }, { where: { estimate_id: estimate_id } })
            }
            if (totals.printing_cost) {
                let update = await req.config.estimations.update({ printing_selling_cost: totals.printing_cost }, { where: { estimate_id: estimate_id } })
            }
            const total_client_cost = Number(totals.selling_price_as_per_duration) + Number(totals.mounting_cost) + Number(totals.printing_cost)
            let update = await req.config.estimations.update({ total_selling_cost: Number(total_client_cost) }, { where: { estimate_id: estimate_id } })
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

        try {
            const userId = req.user.user_id; // Assuming the user ID is available in req.user
            if (Object.keys(differences).length > 0) {
                await req.config.changeLog.create({
                    cost_sheet_id: ccs_id,
                    differences: `${differences}`,
                    changed_by: userId
                });
            }
        } catch (error) {
            console.log("Error in adding cost sheet changes", error)
        }

        return responseSuccess(req, res, "Client Cost Sheet Updated Successfully", updatedCostSheet);
    } catch (error) {
        logErrorToFile(error)
        console.log(error)
        return await responseError(req, res, "Something Went Wrong")
    }
};

exports.deleteAgencyCostSheet = async (req, res) => {
    try {
        const { ccs_id } = req.query; // Assuming the ID is provided as a URL parameter
        // Validate the record exists
        const costSheet = await req.config.agencyClientCostSheet.findOne({ where: { ccs_id: ccs_id } });
        if (!costSheet) {
            return responseError(req, res, "Cost Sheet not found.");
        }
        // Delete the record
        await costSheet.destroy();

        return responseSuccess(req, res, "Client Cost Sheet Deleted Successfully");
    } catch (error) {
        logErrorToFile(error)
        console.log(error)
        return await responseError(req, res, "Something Went Wrong")
    }
};

exports.getAgencyCostSheetsData = async (req, res) => {
    try {
        const { estimate_id } = req.query;
        if (!estimate_id) {
            return await responseError(req, res, "Estimate ID is required");
        }

        let data = await req.config.sitesForAgencyEstimates.findAll({
            where: { estimate_id },
            include: [
                {
                    model: req.config.estimations, paranoid: false,
                    include: [
                        { model: req.config.mediaCampaignManagement, paranoid: false }
                    ]
                },
            ]
        });

        const siteIds = data.map(record => record.site_id);
        const estimateIds = data.map(record => record.estimate_id);

        const clientCostSheets = await req.config.agencyClientCostSheet.findAll({
            where: {
                site_id: { [Op.in]: siteIds },
                estimate_id: { [Op.in]: estimateIds },
            },
        });

        const mappedData = data.map(record => {
            const costSheet = clientCostSheets.find(sheet => sheet.site_id === record.site_id && sheet.estimate_id === record.estimate_id);
            const totalSqFt = record.width * record.height;
            return {
                ccs_id: costSheet ? costSheet.ccs_id : null,
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
                selling_price_as_per_duration: costSheet?.selling_price_as_per_duration || (function () {
                    const displayCost = Number(record?.client_display_cost * totalSqFt) || 0;
                    // const price = Number(displayCost / 30 * (Number(record.db_estimate?.db_media_campaign?.campaign_duration) || Number(Math.floor((new Date(record.db_estimate?.db_media_campaign?.campaign_end_date) - new Date(record.db_estimate?.db_media_campaign?.campaign_start_date)) / (1000 * 60 * 60 * 24)))));
                    // return Number(price.toFixed(2));
                    const price = Number(displayCost / 30 * (record?.duration ||
                        Number(Math.floor((new Date(record?.end_date) - new Date(record?.start_date)) / (1000 * 60 * 60 * 24))) ||
                        Number(record.db_estimate?.db_media_campaign?.campaign_duration) ||
                        Number(Math.floor((new Date(record.db_estimate?.db_media_campaign?.campaign_end_date) - new Date(record.db_estimate?.db_media_campaign?.campaign_start_date)) / (1000 * 60 * 60 * 24))) || 0));
                    return Number(price.toFixed(2));
                })(),
                _client_po_cost: record?._client_po_cost || (function () {
                    const displayCost = Number(record?.client_display_cost * totalSqFt) || 0;
                    // const price = Number(displayCost / 30 * (Number(record.db_estimate?.db_media_campaign?.campaign_duration) || Number(Math.floor((new Date(record.db_estimate?.db_media_campaign?.campaign_end_date) - new Date(record.db_estimate?.db_media_campaign?.campaign_start_date)) / (1000 * 60 * 60 * 24)))));
                    const price = Number(displayCost / 30 * (record?.duration ||
                        Number(Math.floor((new Date(record?.end_date) - new Date(record?.start_date)) / (1000 * 60 * 60 * 24))) ||
                        Number(record.db_estimate?.db_media_campaign?.campaign_duration) ||
                        Number(Math.floor((new Date(record.db_estimate?.db_media_campaign?.campaign_end_date) - new Date(record.db_estimate?.db_media_campaign?.campaign_start_date)) / (1000 * 60 * 60 * 24))) || 0));
                    return Number(price.toFixed(2));
                })() + Number(record?.client_mounting_cost * totalSqFt || 0) + Number(record?.client_printing_cost * totalSqFt || 0) || null,

                mounting_cost_per_sq_ft: costSheet?.mounting_cost_per_sq_ft || record?.client_mounting_cost || 0,
                mounting_cost: costSheet?.mounting_cost || record?.client_mounting_cost * totalSqFt || 0,
                printing_cost_per_sq_ft: costSheet?.printing_cost_per_sq_ft || record?.client_printing_cost || 0,
                printing_cost: costSheet?.printing_cost || record?.client_printing_cost * totalSqFt || 0,

                remarks: costSheet?.remarks || ""
            };
        });
        const totals = {
            selling_price_as_per_duration: mappedData.reduce((acc, item) => acc + item.selling_price_as_per_duration, 0),
            mounting_cost: mappedData.reduce((acc, item) => acc + item.mounting_cost, 0),
            printing_cost: mappedData.reduce((acc, item) => acc + item.printing_cost, 0)
        };
        return await res.status(200).json({ status: 200, message: "Agency Cost Sheets Fetched Successfully", data: mappedData, totals: totals })

    } catch (error) {
        console.error(error);
        return await responseError(req, res, "Something Went Wrong");
    }
};
