const { Sequelize, DataTypes, QueryTypes, where, Op } = require("sequelize");
const { responseError, responseSuccess } = require("../../helper/responce");

exports.addJobCard = async (req, res) => {
    try {
        const { estimate_id, types } = req.body;
        let jobCardsArray = [];

        if (!estimate_id || estimate_id === "") {
            return await responseError(req, res, "Estimate ID is required and cannot be empty");
        }

        if (!types || types.length <= 0) {
            return await responseError(req, res, "Please specify the Vendor Types to generate cards.");
        }

        const estimate = await req.config.estimations.findOne({
            where: { estimate_id: estimate_id },
            include: [{ model: req.config.mediaCampaignManagement }]
        });

        if (!estimate) return await responseError(req, res, "Enter a valid Estimate ID");

        const campaign = estimate?.db_media_campaign;
        const cmpn_b_t_id = campaign?.cmpn_b_t_id;

        if (cmpn_b_t_id == 1) {  //Asset
            let count = await req.config.jobCards.count()
            const costSheets = await req.config.assetVendorCostSheet.findAll({
                where: { campaign_id: campaign?.campaign_id },
                include: [
                    {
                        model: req.config.sites, paranoid: false,
                        attributes: ['acc_id', 'site_code', 'm_t_id', 'location'],
                        include: [
                            { model: req.config.mediaType, paranoid: false, },
                        ]
                    },
                    { model: req.config.printingMaterial, paranoid: false },
                    {
                        model: req.config.mediaCampaignManagement, paranoid: false,
                        attributes: ['campaign_id', 'campaign_name', 'campaign_code', 'acc_id', 'cmpn_b_t_id', 'campaign_start_date', 'campaign_end_date', 'campaign_duration', 'proof_attachment', 'createdAt', 'updatedAt']
                    },
                    {
                        model: req.config.accounts, as: 'printingVendor',
                        foreignKey: 'printing_vendor_id', paranoid: false,
                        attributes: ['acc_id', 'account_type_id', 'acc_name', 'acc_code']
                    },
                    {
                        model: req.config.accounts, as: 'mountingVendor',
                        foreignKey: 'mounting_vendor_id', paranoid: false,
                        attributes: ['acc_id', 'account_type_id', 'acc_name', 'acc_code']
                    },
                    {
                        model: req.config.accounts, as: 'displayVendor',
                        foreignKey: 'display_vendor_id', paranoid: false,
                        attributes: ['acc_id', 'account_type_id', 'acc_name', 'acc_code']
                    },
                ]
            })

            for (const costSheet of costSheets) {
                if (types.includes('12')) {
                    let check = await req.config.jobCards.findOne({
                        estimate_id: estimate_id,
                        campaign_id: campaign?.campaign_id,
                        site_id_asset: costSheet?.site_id,
                    })
                    if (!check) {
                        let arrObject12 = {
                            jc_request_date: new Date(),
                            estimate_id: estimate_id,
                            estimation_code: estimate?.estimation_code,
                            campaign_id: campaign?.campaign_id,
                            campaign_start_date: campaign?.campaign_start_date,
                            campaign_end_date: campaign?.campaign_end_date,
                            campaign_duration: campaign?.campaign_duration,
                            campaign_code: campaign?.campaign_code,
                            site_id_asset: costSheet?.site_id,
                            site_code: costSheet?.db_site?.site_code,
                            site_state: costSheet?.state,
                            site_city: costSheet?.city,
                            site_location: costSheet?.db_site?.location,
                            site_height: costSheet?.height,
                            site_width: costSheet?.width,
                            total_per_sq_ft: costSheet?.total_sq_ft,
                            site_quantity: costSheet?.quantity,
                        }
                        arrObject12.jc_code = `JC_${(count + 1).toString().padStart(7, '0')}`,
                            arrObject12.cost_per_sq_ft = costSheet?.buying_price_as_per_duration / costSheet?.total_sq_ft || null,
                            arrObject12.site_total_payout = costSheet?.buying_price_as_per_duration || null,
                            arrObject12.jc_vendor_code = costSheet?.displayVendor?.acc_code || null,
                            arrObject12.jc_vendor_name = costSheet?.displayVendor?.acc_name || null,
                            arrObject12.acc_id = costSheet?.displayVendor?.acc_id || null,
                            arrObject12.account_type_id = 12,
                            jobCardsArray.push(arrObject12)
                        count++
                    }
                }
                if (types.includes('13')) {
                    let check = await req.config.jobCards.findOne({
                        estimate_id: estimate_id,
                        campaign_id: campaign?.campaign_id,
                        site_id_asset: costSheet?.site_id,
                    })
                    if (!check) {
                        let arrObject13 = {
                            jc_request_date: new Date(),
                            estimate_id: estimate_id,
                            estimation_code: estimate?.estimation_code,
                            campaign_id: campaign?.campaign_id,
                            campaign_start_date: campaign?.campaign_start_date,
                            campaign_end_date: campaign?.campaign_end_date,
                            campaign_duration: campaign?.campaign_duration,
                            campaign_code: campaign?.campaign_code,
                            site_id_asset: costSheet?.site_id,
                            site_code: costSheet?.db_site?.site_code,
                            site_state: costSheet?.state,
                            site_city: costSheet?.city,
                            site_location: costSheet?.db_site?.location,
                            site_height: costSheet?.height,
                            site_width: costSheet?.width,
                            total_per_sq_ft: costSheet?.total_sq_ft,
                            site_quantity: costSheet?.quantity,
                        }
                        arrObject13.jc_code = `JC_${(count + 1).toString().padStart(7, '0')}`,
                            arrObject13.cost_per_sq_ft = costSheet?.printing_cost_per_sq_ft,
                            arrObject13.site_total_payout = costSheet?.printing_cost || null,
                            arrObject13.jc_vendor_code = costSheet?.printingVendor?.acc_code || null,
                            arrObject13.jc_vendor_name = costSheet?.printingVendor?.acc_name || null,
                            arrObject13.acc_id = costSheet?.printingVendor?.acc_id || null,
                            arrObject13.printing_material = costSheet?.db_printing_material?.pr_m_name || null,
                            arrObject13.account_type_id = 13,
                            jobCardsArray.push(arrObject13)
                        count++
                    }
                }
                if (types.includes('14')) {
                    let check = await req.config.jobCards.findOne({
                        estimate_id: estimate_id,
                        campaign_id: campaign?.campaign_id,
                        site_id_asset: costSheet?.site_id,
                    })
                    if (!check) {
                        let arrObject14 = {
                            jc_request_date: new Date(),
                            estimate_id: estimate_id,
                            estimation_code: estimate?.estimation_code,
                            campaign_id: campaign?.campaign_id,
                            campaign_start_date: campaign?.campaign_start_date,
                            campaign_end_date: campaign?.campaign_end_date,
                            campaign_duration: campaign?.campaign_duration,
                            campaign_code: campaign?.campaign_code,
                            site_id_asset: costSheet?.site_id,
                            site_code: costSheet?.db_site?.site_code,
                            site_state: costSheet?.state,
                            site_city: costSheet?.city,
                            site_location: costSheet?.db_site?.location,
                            site_height: costSheet?.height,
                            site_width: costSheet?.width,
                            total_per_sq_ft: costSheet?.total_sq_ft,
                            site_quantity: costSheet?.quantity,
                        }
                        arrObject14.jc_code = `JC_${(count + 1).toString().padStart(7, '0')}`,
                            arrObject14.cost_per_sq_ft = costSheet?.mounting_cost_per_sq_ft,
                            arrObject14.site_total_payout = costSheet?.mounting_cost || null,
                            arrObject14.jc_vendor_code = costSheet?.mountingVendor?.acc_code || null,
                            arrObject14.jc_vendor_name = costSheet?.mountingVendor?.acc_name || null,
                            arrObject14.acc_id = costSheet?.mountingVendor?.acc_id || null,
                            arrObject14.account_type_id = 14,
                            jobCardsArray.push(arrObject14)
                        count++
                    }
                }
            }
        }

        if (cmpn_b_t_id == 2) {  //Agency
            let count = await req.config.jobCards.count()
            const costSheets = await req.config.sitesForAgencyEstimates.findAll({
                where: { estimate_id: estimate_id },
                include: [
                    {
                        model: req.config.agencyVendorCostSheet, paranoid: false,
                        include: [
                            { model: req.config.printingMaterial, paranoid: false },
                            {
                                model: req.config.accounts, as: 'displayVendorAgency',
                                foreignKey: 'display_vendor_id', paranoid: false,
                                attributes: ['acc_id', 'account_type_id', 'acc_name', 'acc_code']

                            },
                            {
                                model: req.config.accounts, as: 'printingVendorAgency',
                                foreignKey: 'printing_vendor_id', paranoid: false,
                                attributes: ['acc_id', 'account_type_id', 'acc_name', 'acc_code']

                            },
                            {
                                model: req.config.accounts, as: 'mountingVendorAgency',
                                foreignKey: 'mounting_vendor_id', paranoid: false,
                                attributes: ['acc_id', 'account_type_id', 'acc_name', 'acc_code']

                            },
                        ]
                    },
                ]
            });
            for (const costSheet of costSheets) {
                if (types.includes('10')) {
                    let check = await req.config.jobCards.findOne({
                        estimate_id: estimate_id,
                        campaign_id: campaign?.campaign_id,
                        site_id_agency: costSheet?.site_id,
                    })
                    if (!check) {
                        let arrObject10 = {
                            jc_request_date: new Date(),
                            estimate_id: estimate_id,
                            estimation_code: estimate?.estimation_code,
                            campaign_id: campaign?.campaign_id,
                            campaign_start_date: campaign?.campaign_start_date,
                            campaign_end_date: campaign?.campaign_end_date,
                            campaign_duration: campaign?.campaign_duration,
                            campaign_code: campaign?.campaign_code,
                            site_id_agency: costSheet?.site_id,
                            site_code: costSheet?.site_code,
                            site_state: costSheet?.state_id,
                            site_city: costSheet?.city_id,
                            site_location: costSheet?.location,
                            site_height: costSheet?.height,
                            site_width: costSheet?.width,
                            total_per_sq_ft: costSheet?.height * costSheet?.width,
                            site_quantity: costSheet?.quantity,
                        }
                        arrObject10.jc_code = `JC_${(count + 1).toString().padStart(7, '0')}`,
                            arrObject10.cost_per_sq_ft = costSheet?.db_agency_vendor_cost_sheets[0]?.buying_price_as_per_duration / costSheet?.db_agency_vendor_cost_sheets[0]?.total_sq_ft || null,
                            arrObject10.site_total_payout = costSheet?.db_agency_vendor_cost_sheets[0]?.buying_price_as_per_duration || null,
                            arrObject10.jc_vendor_code = costSheet?.db_agency_vendor_cost_sheets[0]?.displayVendorAgency?.acc_code || null,
                            arrObject10.jc_vendor_name = costSheet?.db_agency_vendor_cost_sheets[0]?.displayVendorAgency?.acc_name || null,
                            arrObject10.acc_id = costSheet?.db_agency_vendor_cost_sheets[0]?.displayVendorAgency?.acc_id || null,
                            arrObject10.account_type_id = 10,
                            jobCardsArray.push(arrObject10)
                        count++
                    }
                }
                if (types.includes('13')) {
                    let check = await req.config.jobCards.findOne({
                        estimate_id: estimate_id,
                        campaign_id: campaign?.campaign_id,
                        site_id_agency: costSheet?.site_id,
                    })
                    if (!check) {
                        let arrObject13 = {
                            jc_request_date: new Date(),
                            estimate_id: estimate_id,
                            estimation_code: estimate?.estimation_code,
                            campaign_id: campaign?.campaign_id,
                            campaign_start_date: campaign?.campaign_start_date,
                            campaign_end_date: campaign?.campaign_end_date,
                            campaign_duration: campaign?.campaign_duration,
                            campaign_code: campaign?.campaign_code,
                            site_id_agency: costSheet?.site_id,
                            site_code: costSheet?.site_code,
                            site_state: costSheet?.state_id,
                            site_city: costSheet?.city_id,
                            site_location: costSheet?.location,
                            site_height: costSheet?.height,
                            site_width: costSheet?.width,
                            total_per_sq_ft: costSheet?.height * costSheet?.width,
                            site_quantity: costSheet?.quantity,
                        }
                        arrObject13.jc_code = `JC_${(count + 1).toString().padStart(7, '0')}`,
                            arrObject13.cost_per_sq_ft = costSheet?.db_agency_vendor_cost_sheets[0]?.printing_cost / costSheet?.db_agency_vendor_cost_sheets[0]?.total_sq_ft || null,
                            arrObject13.site_total_payout = costSheet?.db_agency_vendor_cost_sheets[0]?.printing_cost || null,
                            arrObject13.jc_vendor_code = costSheet?.db_agency_vendor_cost_sheets[0]?.printingVendorAgency?.acc_code || null,
                            arrObject13.jc_vendor_name = costSheet?.db_agency_vendor_cost_sheets[0]?.printingVendorAgency?.acc_name || null,
                            arrObject13.acc_id = costSheet?.db_agency_vendor_cost_sheets[0]?.printingVendorAgency?.acc_id || null,
                            arrObject13.printing_material = costSheet?.db_agency_vendor_cost_sheets[0]?.db_printing_material?.pr_m_name || null,
                            arrObject13.account_type_id = 13,
                            jobCardsArray.push(arrObject13)
                        count++
                    }
                }
                if (types.includes('14')) {
                    let check = await req.config.jobCards.findOne({
                        estimate_id: estimate_id,
                        campaign_id: campaign?.campaign_id,
                        site_id_agency: costSheet?.site_id,
                    })
                    if (!check) {
                        let arrObject14 = {
                            jc_request_date: new Date(),
                            estimate_id: estimate_id,
                            estimation_code: estimate?.estimation_code,
                            campaign_id: campaign?.campaign_id,
                            campaign_start_date: campaign?.campaign_start_date,
                            campaign_end_date: campaign?.campaign_end_date,
                            campaign_duration: campaign?.campaign_duration,
                            campaign_code: campaign?.campaign_code,
                            site_id_agency: costSheet?.site_id,
                            site_code: costSheet?.site_code,
                            site_state: costSheet?.state_id,
                            site_city: costSheet?.city_id,
                            site_location: costSheet?.location,
                            site_height: costSheet?.height,
                            site_width: costSheet?.width,
                            total_per_sq_ft: costSheet?.height * costSheet?.width,
                            site_quantity: costSheet?.quantity,
                        }
                        arrObject14.jc_code = `JC_${(count + 1).toString().padStart(7, '0')}`,
                            arrObject14.cost_per_sq_ft = costSheet?.db_agency_vendor_cost_sheets[0]?.mounting_cost / costSheet?.db_agency_vendor_cost_sheets[0]?.total_sq_ft || null,
                            arrObject14.site_total_payout = costSheet?.db_agency_vendor_cost_sheets[0]?.mounting_cost || null,
                            arrObject14.jc_vendor_code = costSheet?.db_agency_vendor_cost_sheets[0]?.mountingVendorAgency?.acc_code || null,
                            arrObject14.jc_vendor_name = costSheet?.db_agency_vendor_cost_sheets[0]?.mountingVendorAgency?.acc_name || null,
                            arrObject14.acc_id = costSheet?.db_agency_vendor_cost_sheets[0]?.mountingVendorAgency?.acc_id || null,
                            arrObject14.account_type_id = 14,
                            jobCardsArray.push(arrObject14)
                        count++
                    }
                }
            }
        }

        let data = await req.config.jobCards.bulkCreate(jobCardsArray)

        return await responseSuccess(req, res, "Job Card Created Successfully", data);

    } catch (error) {
        logErrorToFile(error);
        console.error(error);
        return await responseError(req, res, "Something Went Wrong");
    }
};

exports.getJobCard = async (req, res) => {
    try {
        let data
        const { jc_id, estimate_id } = req.query

        if (jc_id && jc_id != null && jc_id != "") {
            data = await req.config.jobCards.findOne({ where: { jc_id: jc_id } })
        }
        else if (estimate_id && estimate_id != null && estimate_id != "") {
            data = await req.config.jobCards.findAll({ where: { estimate_id: estimate_id } })
        }
        else {
            data = await req.config.jobCards.findAll()
        }
        return await responseSuccess(req, res, "Job Cards Fetched Succesfully", data)

    } catch (error) {
        logErrorToFile(error)
        console.log(error)
        return await responseError(req, res, "Something Went Wrong")
    }
}

exports.updateJobCard = async (req, res) => {
    try {
        let data
        const { jc_id, status } = req.body

        data = await req.config.jobCards.findOne({ where: { jc_id: jc_id } })
        if (!data) {
            return await responseError(req, res, "The Job Card ID does not exist or disabled")
        }
        if (status == true || status == false) {
            await data.update({ status: status })
            return await responseSuccess(req, res, status ? "Job Card Enabled Succesfully" : "Job Card Disabled Succesfully")
        } else {
            await data.update(req.body)
            return await responseSuccess(req, res, "Job Card Updated Succesfully")
        }

    } catch (error) {
        logErrorToFile(error)
        console.log(error)
        return await responseError(req, res, "Something Went Wrong")
    }
}

exports.deleteJobCard = async (req, res) => {
    try {
        let data
        const { jc_id } = req.query

        data = await req.config.jobCards.findOne({ where: { jc_id: jc_id } })
        if (!data) {
            return await responseError(req, res, "The Job Card ID does not exist or disabled")
        }
        await data.destroy()
        return await responseSuccess(req, res, "Job Card Deleted Succesfully")

    } catch (error) {
        logErrorToFile(error)
        console.log(error)
        return await responseError(req, res, "Something Went Wrong")
    }
}

