const { Sequelize, DataTypes, QueryTypes, where, Op } = require("sequelize");
const { responseError, responseSuccess, getEstimateCode } = require("../../helper/responce");

exports.addPurchaseOrder = async (req, res) => {
    try {
        let body = req.body
        const { estimate_id, campaign_id, acc_id } = body
        const check = await req.config.purchaseOrders.findOne({
            estimate_id: estimate_id,
            campaign_id: campaign_id,
            acc_id: acc_id
        })
        if (check) {
            return await responseError(req, res, "Purchase order already exist")
        }
        let data = await req.config.purchaseOrders.create({
            ...body,
            p_o_code: await getEstimateCode(req, 'po'),
            status: true
        })

        return await responseSuccess(req, res, "Purchase Order Created Succesfully", data)

    } catch (error) {
        logErrorToFile(error)
        console.log(error)
        return await responseError(req, res, "Something Went Wrong")
    }
}

exports.getPurchaseOrder = async (req, res) => {
    try {
        let data
        const { p_o_id, estimate_id, campaign_id } = req.query

        if (p_o_id && p_o_id != null && p_o_id != "") {
            data = await req.config.purchaseOrders.findOne({
                where: { p_o_id: p_o_id },
                include: [
                    { model: req.config.mediaCampaignManagement, paranoid: false },
                    { model: req.config.accounts, paranoid: false },
                    { model: req.config.accountTypes, paranoid: false },
                ]
            })
        }
        else if (estimate_id && estimate_id != null && estimate_id != "") {
            data = await req.config.purchaseOrders.findAll({
                where: { estimate_id: estimate_id },
                include: [
                    { model: req.config.mediaCampaignManagement, paranoid: false },
                    { model: req.config.accounts, paranoid: false },
                    { model: req.config.accountTypes, paranoid: false },
                ]
            })
        }
        else if (campaign_id && campaign_id != null && campaign_id != "") {
            data = await req.config.purchaseOrders.findAll({
                where: { campaign_id: campaign_id },
                include: [
                    { model: req.config.mediaCampaignManagement, paranoid: false },
                    { model: req.config.accounts, paranoid: false },
                    { model: req.config.accountTypes, paranoid: false },
                ]
            })
        }
        else {
            data = await req.config.purchaseOrders.findAll({
                include: [
                    { model: req.config.mediaCampaignManagement, paranoid: false },
                    { model: req.config.accounts, paranoid: false },
                    { model: req.config.accountTypes, paranoid: false },
                ]
            })
        }
        return await responseSuccess(req, res, "Purchase Order Fetched Succesfully", data)

    } catch (error) {
        logErrorToFile(error)
        console.log(error)
        return await responseError(req, res, "Something Went Wrong")
    }
}

exports.updatePurchaseOrder = async (req, res) => {
    try {
        let data
        const { p_o_id, status } = req.body
        let body = req.body

        data = await req.config.purchaseOrders.findOne({ where: { p_o_id: p_o_id } })

        if (!data) {
            return await responseError(req, res, "The Purchase Order does not exist or disabled")
        }

        if (status == true || status == false) {
            await data.update({ status: status })
            return await responseSuccess(req, res, status ? "Purchase Order Enabled Succesfully" : "Purchase Order Disabled Succesfully")
        }

        else {
            await data.update(body)
            return await responseSuccess(req, res, "Purchase Order Updated Succesfully")
        }

    } catch (error) {
        logErrorToFile(error)
        console.log(error)
        return await responseError(req, res, "Something Went Wrong")
    }
}

exports.deletePurchaseOrder = async (req, res) => {
    try {
        let data
        const { p_o_id } = req.query

        data = await req.config.purchaseOrders.findOne({ where: { p_o_id: p_o_id } })
        if (!data) {
            return await responseError(req, res, "The Purchase Order ID does not exist or disabled")
        }
        await data.destroy()
        return await responseSuccess(req, res, "Purchase Order Deleted Succesfully")

    } catch (error) {
        logErrorToFile(error)
        console.log(error)
        return await responseError(req, res, "Something Went Wrong")
    }
}

exports.fetchPurchaseOrder = async (req, res) => {
    try {
        let responseArray = []
        let purchaseOrder
        const { estimate_id, account_type_id } = req.query;
        if (account_type_id) {
            purchaseOrder = await req.config.purchaseOrders.findOne({
                where: { estimate_id, account_type_id }
            });
            if (purchaseOrder) {
                return await responseSuccess(req, res, "Purchase Order Fetched Successfully", purchaseOrder);
            }
        }

        if (!purchaseOrder) {
            const estimate = await req.config.estimations.findOne({
                where: { estimate_id },
                include: [{ model: req.config.mediaCampaignManagement }]
            });

            if (!estimate) {
                return res.status(404).json({ message: "Estimation not found" });
            }

            const campaign = estimate?.db_media_campaign;
            const cmpn_b_t_id = campaign?.cmpn_b_t_id;

            if (cmpn_b_t_id === 1) {  // Asset

                let costSheets = await req.config.assetVendorCostSheet.findAll({
                    where: { campaign_id: campaign?.campaign_id },
                    include: [
                        {
                            model: req.config.sites, paranoid: false,
                            attributes: ['acc_id', 'site_code', 'm_t_id'],
                            include: [
                                { model: req.config.mediaType, paranoid: false, },
                            ]
                        },
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

                const groupedDisplayVendors = {};
                const groupedMountingVendors = {};
                const groupedPrintingVendors = {};

                costSheets.forEach(site => {
                    console.log("site", site)
                    let dvi = site?.displayVendor?.acc_id
                    let mvi = site?.mountingVendor?.acc_id
                    let pvi = site?.printingVendor?.acc_id
                    let d_at_id = site?.displayVendor?.account_type_id
                    let m_at_id = site?.mountingVendor?.account_type_id
                    let p_at_id = site?.printingVendor?.account_type_id
                    let d_ac_name = site?.displayVendor?.acc_name
                    let m_ac_name = site?.mountingVendor?.acc_name
                    let p_ac_name = site?.printingVendor?.acc_name
                    let buying_cost = site?.buying_price_as_per_duration
                    let mounting_cost = site?.mounting_cost
                    let printing_cost = site?.printing_cost
                    let cpn_id = site?.db_media_campaign?.campaign_id
                    let cpn_code = site?.db_media_campaign?.campaign_code
                    let po_start_c = site?.db_media_campaign?.campaign_start_date
                    let po_end_c = site?.db_media_campaign?.campaign_end_date
                    let po_days_c = site?.db_media_campaign?.campaign_duration
                    let mt_id = site?.db_site?.m_t_id
                    let mt_name = site?.db_site?.db_media_type?.m_t_name

                    if (!groupedDisplayVendors[dvi]) { // Display Vendor
                        groupedDisplayVendors[dvi] = {
                            campaign_id: cpn_id,
                            campaign_code: cpn_code,
                            acc_id: dvi,
                            acc_name: d_ac_name,
                            account_type_id: d_at_id,
                            p_o_id: purchaseOrder?.p_o_id || null,
                            p_o_code: purchaseOrder?.p_o_code || null,
                            p_o_date: purchaseOrder?.p_o_date || null,
                            m_t_id: mt_id,
                            m_t_name: mt_name,
                            p_o_cost: 0,
                            p_o_start_date: po_start_c,
                            p_o_end_date: po_end_c,
                            p_o_days: po_days_c,
                            p_o_ndp_days: purchaseOrder?.p_o_ndp_days || null,
                            p_o_invoice: purchaseOrder?.p_o_invoice || null,
                            p_o_payment_status: purchaseOrder?.p_o_payment_status || null,
                            p_o_debit_note_no: purchaseOrder?.p_o_debit_note_no || null,
                            p_o_debit_note_date: purchaseOrder?.p_o_debit_note_date || null,
                            p_o_debit_note_percentage: purchaseOrder?.p_o_debit_note_percentage || null,
                            p_o_debit_note_amount: purchaseOrder?.p_o_debit_note_amount || null,
                            p_o_debit_note_gst: purchaseOrder?.p_o_debit_note_gst || null,
                            p_o_debit_note_remarks: purchaseOrder?.p_o_debit_note_remarks || null,
                        };
                    }
                    if (!groupedMountingVendors[mvi]) {  //Mounting Vendor
                        groupedMountingVendors[mvi] = {
                            campaign_id: cpn_id,
                            campaign_code: cpn_code,
                            acc_id: mvi,
                            acc_name: m_ac_name,
                            account_type_id: m_at_id,
                            p_o_id: purchaseOrder?.p_o_id || null,
                            p_o_code: purchaseOrder?.p_o_code || null,
                            p_o_date: purchaseOrder?.p_o_date || null,
                            m_t_id: mt_id,
                            m_t_name: mt_name,
                            p_o_cost: 0,
                            p_o_start_date: po_start_c,
                            p_o_end_date: po_end_c,
                            p_o_days: po_days_c,
                            p_o_ndp_days: purchaseOrder?.p_o_ndp_days || null,
                            p_o_invoice: purchaseOrder?.p_o_invoice || null,
                            p_o_payment_status: purchaseOrder?.p_o_payment_status || null,
                            p_o_debit_note_no: purchaseOrder?.p_o_debit_note_no || null,
                            p_o_debit_note_date: purchaseOrder?.p_o_debit_note_date || null,
                            p_o_debit_note_percentage: purchaseOrder?.p_o_debit_note_percentage || null,
                            p_o_debit_note_amount: purchaseOrder?.p_o_debit_note_amount || null,
                            p_o_debit_note_gst: purchaseOrder?.p_o_debit_note_gst || null,
                            p_o_debit_note_remarks: purchaseOrder?.p_o_debit_note_remarks || null,
                        };
                    }
                    if (!groupedPrintingVendors[pvi]) {  ///Printing Vendor
                        groupedPrintingVendors[pvi] = {
                            campaign_id: cpn_id,
                            campaign_code: cpn_code,
                            acc_id: pvi,
                            acc_name: p_ac_name,
                            account_type_id: p_at_id,
                            p_o_id: purchaseOrder?.p_o_id || null,
                            p_o_code: purchaseOrder?.p_o_code || null,
                            p_o_date: purchaseOrder?.p_o_date || null,
                            m_t_id: mt_id,
                            m_t_name: mt_name,
                            p_o_cost: 0,
                            p_o_start_date: po_start_c,
                            p_o_end_date: po_end_c,
                            p_o_days: po_days_c,
                            p_o_ndp_days: purchaseOrder?.p_o_ndp_days || null,
                            p_o_invoice: purchaseOrder?.p_o_invoice || null,
                            p_o_payment_status: purchaseOrder?.p_o_payment_status || null,
                            p_o_debit_note_no: purchaseOrder?.p_o_debit_note_no || null,
                            p_o_debit_note_date: purchaseOrder?.p_o_debit_note_date || null,
                            p_o_debit_note_percentage: purchaseOrder?.p_o_debit_note_percentage || null,
                            p_o_debit_note_amount: purchaseOrder?.p_o_debit_note_amount || null,
                            p_o_debit_note_gst: purchaseOrder?.p_o_debit_note_gst || null,
                            p_o_debit_note_remarks: purchaseOrder?.p_o_debit_note_remarks || null,
                        };
                    }
                    groupedDisplayVendors[dvi].p_o_cost += Number(buying_cost) || 0;
                    groupedMountingVendors[mvi].p_o_cost += Number(mounting_cost) || 0;
                    groupedPrintingVendors[pvi].p_o_cost += Number(printing_cost) || 0;
                });

                responseArray = [
                    ...Object.values(groupedDisplayVendors),
                    ...Object.values(groupedMountingVendors),
                    ...Object.values(groupedPrintingVendors)
                ].flat();

                return await responseSuccess(req, res, "Purchase Order Fetched Successfully", responseArray);
            }
            else if (cmpn_b_t_id === 2) {  // Agency

                let costSheets = await req.config.sitesForAgencyEstimates.findAll({
                    where: { estimate_id: estimate_id },
                    include: [
                        {
                            model: req.config.estimations, paranoid: false,
                            attributes: ['estimate_id', 'estimate_date', 'campaign_id', 'est_s_id'],
                            include: [
                                {
                                    model: req.config.mediaCampaignManagement, paranoid: false,
                                    attributes: ['campaign_id', 'campaign_name', 'campaign_code', 'acc_id', 'cmpn_b_t_id', 'campaign_start_date', 'campaign_end_date', 'campaign_duration', 'proof_attachment', 'createdAt', 'updatedAt'],
                                },
                            ]
                        },
                        {
                            model: req.config.agencyVendorCostSheet, paranoid: false,
                            include: [
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
                        }, //Reverse populating agency vendor cost sheets
                    ]
                });

                const groupedDisplayVendors = {};
                const groupedMountingVendors = {};
                const groupedPrintingVendors = {};

                costSheets.forEach(site => {
                    console.log("site", site)
                    let dvi = site?.db_agency_vendor_cost_sheets[0]?.displayVendorAgency?.acc_id
                    let mvi = site?.db_agency_vendor_cost_sheets[0]?.mountingVendorAgency?.acc_id
                    let pvi = site?.db_agency_vendor_cost_sheets[0]?.printingVendorAgency?.acc_id
                    let d_at_id = site?.db_agency_vendor_cost_sheets[0]?.displayVendorAgency?.account_type_id
                    let m_at_id = site?.db_agency_vendor_cost_sheets[0]?.mountingVendorAgency?.account_type_id
                    let p_at_id = site?.db_agency_vendor_cost_sheets[0]?.printingVendorAgency?.account_type_id
                    let d_ac_name = site?.db_agency_vendor_cost_sheets[0]?.displayVendorAgency?.acc_name
                    let m_ac_name = site?.db_agency_vendor_cost_sheets[0]?.mountingVendorAgency?.acc_name
                    let p_ac_name = site?.db_agency_vendor_cost_sheets[0]?.printingVendorAgency?.acc_name
                    let buying_cost = site?.db_agency_vendor_cost_sheets[0]?.buying_price_as_per_duration
                    let mounting_cost = site?.db_agency_vendor_cost_sheets[0]?.mounting_cost
                    let printing_cost = site?.db_agency_vendor_cost_sheets[0]?.printing_cost
                    let cpn_id = site?.db_estimate?.db_media_campaign?.campaign_id
                    let cpn_code = site?.db_estimate?.db_media_campaign?.campaign_code
                    let po_start_c = site?.db_estimate?.db_media_campaign?.campaign_start_date
                    let po_end_c = site?.db_estimate?.db_media_campaign?.campaign_end_date
                    let po_days_c = site?.db_estimate?.db_media_campaign?.campaign_duration
                    let mt_name = site?.m_t_id

                    if (!groupedDisplayVendors[dvi]) { // Display Vendor
                        groupedDisplayVendors[dvi] = {
                            campaign_id: cpn_id,
                            campaign_code: cpn_code,
                            acc_name: d_ac_name,
                            acc_id: dvi,
                            account_type_id: d_at_id,
                            p_o_id: purchaseOrder?.p_o_id || null,
                            p_o_code: purchaseOrder?.p_o_code || null,
                            p_o_date: purchaseOrder?.p_o_date || null,
                            m_t_id: mt_name,
                            m_t_name: mt_name,
                            p_o_cost: 0,
                            p_o_start_date: po_start_c,
                            p_o_end_date: po_end_c,
                            p_o_days: po_days_c,
                            p_o_ndp_days: purchaseOrder?.p_o_ndp_days || null,
                            p_o_invoice: purchaseOrder?.p_o_invoice || null,
                            p_o_payment_status: purchaseOrder?.p_o_payment_status || null,
                            p_o_debit_note_no: purchaseOrder?.p_o_debit_note_no || null,
                            p_o_debit_note_date: purchaseOrder?.p_o_debit_note_date || null,
                            p_o_debit_note_percentage: purchaseOrder?.p_o_debit_note_percentage || null,
                            p_o_debit_note_amount: purchaseOrder?.p_o_debit_note_amount || null,
                            p_o_debit_note_gst: purchaseOrder?.p_o_debit_note_gst || null,
                            p_o_debit_note_remarks: purchaseOrder?.p_o_debit_note_remarks || null,
                        };
                    }
                    if (!groupedMountingVendors[mvi]) {  //Mounting Vendor
                        groupedMountingVendors[mvi] = {
                            campaign_id: cpn_id,
                            campaign_code: cpn_code,
                            acc_name: m_ac_name,
                            acc_id: mvi,
                            account_type_id: m_at_id,
                            p_o_id: purchaseOrder?.p_o_id || null,
                            p_o_code: purchaseOrder?.p_o_code || null,
                            p_o_date: purchaseOrder?.p_o_date || null,
                            m_t_id: mt_name,
                            m_t_name: mt_name,
                            p_o_cost: 0,
                            p_o_start_date: po_start_c,
                            p_o_end_date: po_end_c,
                            p_o_days: po_days_c,
                            p_o_ndp_days: purchaseOrder?.p_o_ndp_days || null,
                            p_o_invoice: purchaseOrder?.p_o_invoice || null,
                            p_o_payment_status: purchaseOrder?.p_o_payment_status || null,
                            p_o_debit_note_no: purchaseOrder?.p_o_debit_note_no || null,
                            p_o_debit_note_date: purchaseOrder?.p_o_debit_note_date || null,
                            p_o_debit_note_percentage: purchaseOrder?.p_o_debit_note_percentage || null,
                            p_o_debit_note_amount: purchaseOrder?.p_o_debit_note_amount || null,
                            p_o_debit_note_gst: purchaseOrder?.p_o_debit_note_gst || null,
                            p_o_debit_note_remarks: purchaseOrder?.p_o_debit_note_remarks || null,
                        };
                    }
                    if (!groupedPrintingVendors[pvi]) {  ///Printing Vendor
                        groupedPrintingVendors[pvi] = {
                            campaign_id: cpn_id,
                            acc_id: pvi, campaign_code: cpn_code,
                            acc_name: p_ac_name,
                            account_type_id: p_at_id,
                            p_o_id: purchaseOrder?.p_o_id || null,
                            p_o_code: purchaseOrder?.p_o_code || null,
                            p_o_date: purchaseOrder?.p_o_date || null,
                            m_t_id: mt_name,
                            m_t_name: mt_name,
                            p_o_cost: 0,
                            p_o_start_date: po_start_c,
                            p_o_end_date: po_end_c,
                            p_o_days: po_days_c,
                            p_o_ndp_days: purchaseOrder?.p_o_ndp_days || null,
                            p_o_invoice: purchaseOrder?.p_o_invoice || null,
                            p_o_payment_status: purchaseOrder?.p_o_payment_status || null,
                            p_o_debit_note_no: purchaseOrder?.p_o_debit_note_no || null,
                            p_o_debit_note_date: purchaseOrder?.p_o_debit_note_date || null,
                            p_o_debit_note_percentage: purchaseOrder?.p_o_debit_note_percentage || null,
                            p_o_debit_note_amount: purchaseOrder?.p_o_debit_note_amount || null,
                            p_o_debit_note_gst: purchaseOrder?.p_o_debit_note_gst || null,
                            p_o_debit_note_remarks: purchaseOrder?.p_o_debit_note_remarks || null,
                        };
                    }
                    groupedDisplayVendors[dvi].p_o_cost += Number(buying_cost) || 0;
                    groupedMountingVendors[mvi].p_o_cost += Number(mounting_cost) || 0;
                    groupedPrintingVendors[pvi].p_o_cost += Number(printing_cost) || 0;
                });

                responseArray = [
                    ...Object.values(groupedDisplayVendors),
                    ...Object.values(groupedMountingVendors),
                    ...Object.values(groupedPrintingVendors)
                ].flat();

                console.log('responseArray', responseArray)

                return await responseSuccess(req, res, "Purchase Order Fetched Successfully", responseArray);
            }
        }

    } catch (error) {
        console.error(error);
        return await responseError(req, res, "Something went wrong.");
    }
};

