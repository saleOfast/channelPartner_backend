const { Sequelize, DataTypes, QueryTypes, where, Op } = require("sequelize");
const { responseError, responseSuccess } = require('../helper/responce')
const fs = require('fs');
const path = require('path');
const xlsx = require('xlsx');
const moment = require('moment');

exports.getOpportunity = async (req, res) => {
    try {
        let opportunities;
        let whereClause = {};
        let groupClause = [];
        let attributes = [];
        let orderClause = [['opp_id', 'DESC']]; // Default order by opp_id in descending order

        // Filter by account name
        if (req.query.type === 'ac_name') {
            whereClause.account_name = req.query.ac;
        }

        // Filter by opportunity owner
        if (req.query.type === 'opp_by_owner') {
            whereClause.opp_owner = req.query.opp_owner;
            whereClause.opportunity_stg_id = 3;
        }

        // Default opportunity_stg_id
        if (req.query.opportunity_stg_id) {
            whereClause.opportunity_stg_id = req.query.opportunity_stg_id;
        }

        // Financial Year Filter
        if (req.query.financialYear) {
            const startOfYear = moment(`${req.query.financialYear}-04-01`).startOf('day');
            const endOfYear = moment(`${parseInt(req.query.financialYear) + 1}-03-31`).endOf('day');
            whereClause.createdAt = { [Op.between]: [startOfYear.toDate(), endOfYear.toDate()] };
        }

        // Quarter Filter
        if (req.query.quarter) {
            const quarter = req.query.quarter != 4 ? parseInt(req.query.quarter) + 1 : 1;
            const startOfQuarter = moment().quarter(quarter).startOf('quarter');
            const endOfQuarter = moment().quarter(quarter).endOf('quarter');
            whereClause.createdAt = { [Op.between]: [startOfQuarter.toDate(), endOfQuarter.toDate()] };
        }

        // Month Filter
        if (req.query.month) {
            const month = parseInt(req.query.month);
            const year = req.query.financialYear || moment().year(); // Default to current year if not provided
            const startOfMonth = moment(`${year}-${month}-01`).startOf('month');
            const endOfMonth = moment(`${year}-${month}-01`).endOf('month');
            whereClause.createdAt = { [Op.between]: [startOfMonth.toDate(), endOfMonth.toDate()] };
        }

        // Filter based on user role
        if (!req.user.isDB) {
            whereClause = {
                ...whereClause,
                [Op.or]: [
                    { opp_owner: req.user.user_id },
                    { assigned_to: req.user.user_id }
                ]
            };
        }

        // Handle the 'expected weighted' type
        if (req.query.type === 'expected_weighted') {
            groupClause.push('assigned_to');

            if (req.query.subtype === "avg_deal_size") {
                attributes = [
                    'assigned_to',
                    [Sequelize.fn('SUM', Sequelize.col('amount')), 'total_amount'],
                    [Sequelize.fn('COUNT', Sequelize.col('opp_id')), 'total_opportunities'],
                    [Sequelize.literal('SUM(amount) / COUNT(opp_id)'), 'avg_deal_size'],
                ];
                orderClause = [[Sequelize.literal('avg_deal_size'), 'DESC']]; // Order by avg_deal_size in descending order
            } else {
                attributes = [
                    'assigned_to',
                    [Sequelize.fn('SUM', Sequelize.col('amount')), 'total_amount'],
                ];
                orderClause = [[Sequelize.literal('total_amount'), 'DESC']]; // Order by total_amount in descending order
            }

            // Check if opportunity_stg_id is not provided, set it to [1, 2]
            if (!req.query.opportunity_stg_id) {
                whereClause.opportunity_stg_id = { [Op.in]: [1, 2] };
            }
            if (req.query.subtype === "avg_deal_size") {
                whereClause.opportunity_stg_id = 3;
            }
        } else {
            attributes = {};
        }

        // Fetch the opportunities based on the conditions
        opportunities = await req.config.opportunities.findAll({
            where: whereClause,
            attributes: attributes,
            group: groupClause.length ? groupClause : undefined,
            include: [
                {
                    model: req.config.accounts, as: "accName", attributes: {
                        exclude: ["createdAt", "updatedAt", "deletedAt"]
                    }, paranoid: false
                },
                { model: req.config.users, as: "oppOwner", attributes: ['user_id', 'user'], paranoid: false, },
                { model: req.config.users, as: "assignedOpp", attributes: ['user_id', 'user'], paranoid: false, },
                {
                    model: req.config.opprType, attributes: {
                        exclude: ["createdAt", "updatedAt", "deletedAt"]
                    }, paranoid: false
                },
                {
                    model: req.config.opprStage, attributes: {
                        exclude: ["createdAt", "updatedAt", "deletedAt"]
                    }, paranoid: false
                },
                {
                    model: req.config.leadSources, attributes: {
                        exclude: ["createdAt", "updatedAt", "deletedAt"]
                    }, paranoid: false
                },
            ],
            order: orderClause
        });

        return await responseSuccess(req, res, "Opportunities list", opportunities);

    } catch (error) {
        logErrorToFile(error);
        console.log(error);
        return await responseError(req, res, "Something Went Wrong");
    }
};

const dateChange = (date) => {
    const dueDate = new Date(date);
    const formattedDueDate = dueDate.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' });
    return formattedDueDate
}

exports.downloadExcelData = async (req, res) => {
    try {
        let opportunities;
        let whereClause = {};
        let groupClause = [];
        let attributes = [];
        let orderClause = [['opp_id', 'DESC']]; // Default order by opp_id in descending order

        // Filter by account name
        if (req.query.type === 'ac_name') {
            whereClause.account_name = req.query.ac;
        }

        // Filter by opportunity owner
        if (req.query.type === 'opp_by_owner') {
            whereClause.opp_owner = req.query.opp_owner;
            whereClause.opportunity_stg_id = 3;
        }

        // Default opportunity_stg_id
        if (req.query.opportunity_stg_id) {
            whereClause.opportunity_stg_id = req.query.opportunity_stg_id;
        }

        // Financial Year Filter
        if (req.query.financialYear) {
            const startOfYear = moment(`${req.query.financialYear}-04-01`).startOf('day');
            const endOfYear = moment(`${parseInt(req.query.financialYear) + 1}-03-31`).endOf('day');
            whereClause.createdAt = { [Op.between]: [startOfYear.toDate(), endOfYear.toDate()] };
        }

        // Quarter Filter
        if (req.query.quarter) {
            const quarter = req.query.quarter != 4 ? parseInt(req.query.quarter) + 1 : 1;
            const startOfQuarter = moment().quarter(quarter).startOf('quarter');
            const endOfQuarter = moment().quarter(quarter).endOf('quarter');
            whereClause.createdAt = { [Op.between]: [startOfQuarter.toDate(), endOfQuarter.toDate()] };
        }

        // Month Filter
        if (req.query.month) {
            const month = parseInt(req.query.month);
            const year = req.query.financialYear || moment().year(); // Default to current year if not provided
            const startOfMonth = moment(`${year}-${month}-01`).startOf('month');
            const endOfMonth = moment(`${year}-${month}-01`).endOf('month');
            whereClause.createdAt = { [Op.between]: [startOfMonth.toDate(), endOfMonth.toDate()] };
        }

        // Filter based on user role
        if (!req.user.isDB) {
            whereClause = {
                ...whereClause,
                [Op.or]: [
                    { opp_owner: req.user.user_id },
                    { assigned_to: req.user.user_id }
                ]
            };
        }

        // Handle the 'expected weighted' type
        if (req.query.type === 'expected_weighted') {
            groupClause.push('assigned_to');

            if (req.query.subtype === "avg_deal_size") {
                attributes = [
                    'assigned_to',
                    [Sequelize.fn('SUM', Sequelize.col('amount')), 'total_amount'],
                    [Sequelize.fn('COUNT', Sequelize.col('opp_id')), 'total_opportunities'],
                    [Sequelize.literal('SUM(amount) / COUNT(opp_id)'), 'avg_deal_size'],
                ];
                orderClause = [[Sequelize.literal('avg_deal_size'), 'DESC']]; // Order by avg_deal_size in descending order
            } else {
                attributes = [
                    'assigned_to',
                    [Sequelize.fn('SUM', Sequelize.col('amount')), 'total_amount'],
                ];
                orderClause = [[Sequelize.literal('total_amount'), 'DESC']]; // Order by total_amount in descending order
            }

            // Check if opportunity_stg_id is not provided, set it to [1, 2]
            if (!req.query.opportunity_stg_id) {
                whereClause.opportunity_stg_id = { [Op.in]: [1, 2] };
            }
            if (req.query.subtype === "avg_deal_size") {
                whereClause.opportunity_stg_id = 3;
            }
        } else {
            attributes = {};
        }

        let excelClientData = []

        // Fetch the opportunities based on the conditions
        opportunities = await req.config.opportunities.findAll({
            where: whereClause,
            attributes: attributes,
            group: groupClause.length ? groupClause : undefined,
            include: [
                {
                    model: req.config.accounts, as: "accName", attributes: {
                        exclude: ["createdAt", "updatedAt", "deletedAt"]
                    }, paranoid: false
                },
                { model: req.config.users, as: "oppOwner", attributes: ['user_id', 'user'], paranoid: false, },
                { model: req.config.users, as: "assignedOpp", attributes: ['user_id', 'user'], paranoid: false, },
                {
                    model: req.config.opprType, attributes: {
                        exclude: ["createdAt", "updatedAt", "deletedAt"]
                    }, paranoid: false
                },
                {
                    model: req.config.opprStage, attributes: {
                        exclude: ["createdAt", "updatedAt", "deletedAt"]
                    }, paranoid: false
                },
                {
                    model: req.config.leadSources, attributes: {
                        exclude: ["createdAt", "updatedAt", "deletedAt"]
                    }, paranoid: false
                },
            ],
            order: orderClause
        });
        if (req.query.type == 'expected_weighted' && req.query.opportunity_stg_id == 2) {
            opportunities?.forEach(element => {
                let item = {
                    "Name": element?.dataValues?.assignedOpp?.dataValues?.user ? element?.dataValues?.assignedOpp?.dataValues?.user : 'Unassigned Opportunities',
                    "Amount": element?.dataValues?.total_amount
                }
                excelClientData.push(item)
            });
        }
        else if (req.query.type == 'expected_weighted' && req.query.subtype == 'avg_deal_size') {
            opportunities?.forEach(element => {
                let item = {
                    "Name": element?.dataValues?.assignedOpp?.dataValues?.user ? element?.dataValues?.assignedOpp?.dataValues?.user : 'Unassigned Opportunities',
                    "Average Deal Size": element?.dataValues?.avg_deal_size
                }
                excelClientData.push(item)
            });
        }
        else if (req.query.type == 'expected_weighted') {
            opportunities?.forEach(element => {
                let item = {
                    "Name": element?.dataValues?.assignedOpp?.dataValues?.user ? element?.dataValues?.assignedOpp?.dataValues?.user : 'Unassigned Opportunities',
                    "Average Deal Size": element?.dataValues?.total_amount
                }
                excelClientData.push(item)
            });
        }
        else {
            opportunities?.forEach(element => {
                let item = {
                    "Name": element?.dataValues?.opp_name ? element?.dataValues?.opp_name : 'Unassigned Opportunities',
                    "Owner": element?.dataValues?.oppOwner?.dataValues?.user,
                    "Assigned To": element?.dataValues?.assignedOpp?.dataValues?.user,
                    "Type": element?.dataValues?.db_opportunity_type?.dataValues?.opportunity_type_name,
                    "Stage": element?.dataValues?.db_opportunity_stg?.dataValues?.opportunity_stg_name,
                    "Account Name": element?.dataValues.accName?.dataValues.acc_name,
                    "Close Date": dateChange(element?.dataValues?.close_date),
                    "Amount": element?.dataValues?.amount,
                    "Description": element?.dataValues?.desc,
                    "Lead Source": element?.dataValues?.db_lead_source?.dataValues?.source,
                }
                excelClientData.push(item)
            });
        }

        // let excelClientData = lead?.map((item)=> item.dataValues)
        const workbook = xlsx.utils.book_new();
        const worksheet = xlsx.utils.json_to_sheet(excelClientData);
        // Add the worksheet to the workbook
        xlsx.utils.book_append_sheet(workbook, worksheet, 'Sheet1');

        // Generate a temporary file path to save the Excel workbook
        const tempFilePath = path.join(__dirname, `../uploads/temp`, 'temp.xlsx');

        // Write the workbook to a file
        xlsx.writeFile(workbook, tempFilePath);

        // Set the response headers
        res.setHeader('Content-Type', 'application/vnd.ms-excel');
        res.setHeader('Content-Disposition', 'attachment; filename=example.xlsx');

        // Stream the file to the response
        const stream = fs.createReadStream(tempFilePath);
        stream.pipe(res);

        // Delete the temporary file after sending the response
        stream.on('end', () => {
            fs.unlinkSync(tempFilePath);
        });

        return

    } catch (error) {
        logErrorToFile(error);
        console.log(error);
        return await responseError(req, res, "Something Went Wrong");
    }
};

exports.downloadExcelDataOpportunityRatio = async (req, res) => {
    try {
        let whereClause = {};

        // Filter based on user role
        if (!req.user.isDB) {
            whereClause = {
                ...whereClause,
                [Op.or]: [
                    { opp_owner: req.user.user_id },
                    { assigned_to: req.user.user_id }
                ]
            };
        }

        // Fetch the summary of opportunities grouped by assigned_to
        const opportunities = await req.config.opportunities.findAll({
            where: whereClause,
            attributes: [
                'assigned_to',
                [Sequelize.fn('COUNT', Sequelize.col('opp_id')), 'total_opportunities'],
                [Sequelize.fn('SUM', Sequelize.literal(`CASE WHEN opportunity_stg_id = 3 THEN 1 ELSE 0 END`)), 'closed_won_opportunities'],
                [Sequelize.literal(`SUM(CASE WHEN opportunity_stg_id = 3 THEN 1 ELSE 0 END) / COUNT(opp_id)`), 'closed_won_ratio']
            ],
            group: ['assigned_to'],
            include: [
                { model: req.config.users, as: 'assignedOpp', attributes: ['user_id', 'user'], paranoid: false },
            ],
        });

        let excelClientData = []

        opportunities?.forEach(element => {
            let item = {
                "Name": element?.dataValues?.assignedOpp?.dataValues?.user ? element?.dataValues?.assignedOpp?.dataValues?.user : 'Unassigned Opportunities',
                "Won Opportunities": element?.dataValues?.closed_won_opportunities,
                "Total Opportunities": element?.dataValues?.total_opportunities,
                "Win Ratio": `${element?.dataValues?.closed_won_opportunities} : ${element?.dataValues?.total_opportunities}`,
                "Win Ratio Literal": element?.dataValues?.closed_won_ratio,
            }
            excelClientData.push(item)
        });

        // let excelClientData = lead?.map((item)=> item.dataValues)
        const workbook = xlsx.utils.book_new();
        const worksheet = xlsx.utils.json_to_sheet(excelClientData);
        // Add the worksheet to the workbook
        xlsx.utils.book_append_sheet(workbook, worksheet, 'Sheet1');

        // Generate a temporary file path to save the Excel workbook
        const tempFilePath = path.join(__dirname, `../uploads/temp`, 'temp.xlsx');

        // Write the workbook to a file
        xlsx.writeFile(workbook, tempFilePath);

        // Set the response headers
        res.setHeader('Content-Type', 'application/vnd.ms-excel');
        res.setHeader('Content-Disposition', 'attachment; filename=example.xlsx');

        // Stream the file to the response
        const stream = fs.createReadStream(tempFilePath);
        stream.pipe(res);

        // Delete the temporary file after sending the response
        stream.on('end', () => {
            fs.unlinkSync(tempFilePath);
        });

        return

    } catch (error) {
        logErrorToFile(error);
        console.log(error);
        return await responseError(req, res, "Something Went Wrong");
    }
};

exports.getOpportunityRatio = async (req, res) => {
    try {
        let whereClause = {};

        // Filter based on user role
        if (!req.user.isDB) {
            whereClause = {
                ...whereClause,
                [Op.or]: [
                    { opp_owner: req.user.user_id },
                    { assigned_to: req.user.user_id }
                ]
            };
        }

        // Fetch the summary of opportunities grouped by assigned_to
        const opportunities = await req.config.opportunities.findAll({
            where: whereClause,
            attributes: [
                'assigned_to',
                [Sequelize.fn('COUNT', Sequelize.col('opp_id')), 'total_opportunities'],
                [Sequelize.fn('SUM', Sequelize.literal(`CASE WHEN opportunity_stg_id = 3 THEN 1 ELSE 0 END`)), 'closed_won_opportunities'],
                [Sequelize.literal(`SUM(CASE WHEN opportunity_stg_id = 3 THEN 1 ELSE 0 END) / COUNT(opp_id)`), 'closed_won_ratio']
            ],
            group: ['assigned_to'],
            include: [
                { model: req.config.users, as: 'assignedOpp', attributes: ['user_id', 'user'], paranoid: false },
            ],
        });

        // Send the response
        return await responseSuccess(req, res, "Opportunities list", opportunities);

    } catch (error) {
        logErrorToFile(error);
        console.log(error);
        return await responseError(req, res, "Something Went Wrong");
    }
};

exports.downloadExcelDataAverageClosingTime = async (req, res) => {
    try {
        let whereClause = {};

        // Filter based on user role
        if (!req.user.isDB) {
            whereClause = {
                ...whereClause,
                [Op.or]: [
                    { opp_owner: req.user.user_id },
                    { assigned_to: req.user.user_id }
                ]
            };
        }

        // Fetch opportunities with close_date and createdAt
        const opportunities = await req.config.opportunities.findAll({
            where: whereClause,
            attributes: [
                'assigned_to',
                [Sequelize.fn('DATEDIFF', Sequelize.col('close_date'), Sequelize.col('db_opportunity.createdAt')), 'days_difference'],
            ],
            include: [
                {
                    model: req.config.users,
                    as: 'assignedOpp',
                    attributes: ['user_id', 'user']
                }
            ],
            group: ['assigned_to', 'db_opportunity.opp_id'],
            raw: true
        });

        // Group by assigned_to
        const groupedData = opportunities.reduce((acc, curr) => {
            const { assigned_to, days_difference } = curr;

            // Check if days_difference is less than 0
            if (days_difference < 0) {
                return acc; // Skip this entry if days_difference is less than 0
            }

            const assignedToUser = curr['assignedOpp.user'];
            const userId = curr['assignedOpp.user_id'];

            if (!acc[assigned_to]) {
                acc[assigned_to] = {
                    assigned_to: { user_id: userId, user: assignedToUser },
                    opportunities: [],
                    totalDays: 0,
                    totalOpportunities: 0
                };
            }

            acc[assigned_to].opportunities.push({ days_difference });
            acc[assigned_to].totalDays += days_difference;
            acc[assigned_to].totalOpportunities += 1;

            return acc;
        }, {});

        // Calculate average days difference for each assigned_to
        const result = Object.values(groupedData).map(assigned => {
            return {
                assigned_to: assigned.assigned_to,
                average_days_difference: assigned.totalDays / assigned.totalOpportunities
            };
        });
        let excelClientData = []

        result?.forEach(element => {
            let item = {
                "Name": element?.assigned_to?.user ? element?.assigned_to?.user : 'Unassigned Opportunities',
                "Average Days": element?.average_days_difference,
            }
            excelClientData.push(item)
        });

        // let excelClientData = lead?.map((item)=> item.dataValues)
        const workbook = xlsx.utils.book_new();
        const worksheet = xlsx.utils.json_to_sheet(excelClientData);
        // Add the worksheet to the workbook
        xlsx.utils.book_append_sheet(workbook, worksheet, 'Sheet1');

        // Generate a temporary file path to save the Excel workbook
        const tempFilePath = path.join(__dirname, `../uploads/temp`, 'temp.xlsx');

        // Write the workbook to a file
        xlsx.writeFile(workbook, tempFilePath);

        // Set the response headers
        res.setHeader('Content-Type', 'application/vnd.ms-excel');
        res.setHeader('Content-Disposition', 'attachment; filename=example.xlsx');

        // Stream the file to the response
        const stream = fs.createReadStream(tempFilePath);
        stream.pipe(res);

        // Delete the temporary file after sending the response
        stream.on('end', () => {
            fs.unlinkSync(tempFilePath);
        });

        return

    } catch (error) {
        logErrorToFile(error);
        console.log(error);
        return await responseError(req, res, "Something Went Wrong");
    }
};

exports.getAverageClosingTime = async (req, res) => {
    try {
        let whereClause = {};

        // Filter based on user role
        if (!req.user.isDB) {
            whereClause = {
                ...whereClause,
                [Op.or]: [
                    { opp_owner: req.user.user_id },
                    { assigned_to: req.user.user_id }
                ]
            };
        }

        // Fetch opportunities with close_date and createdAt
        const opportunities = await req.config.opportunities.findAll({
            where: whereClause,
            attributes: [
                'assigned_to',
                [Sequelize.fn('DATEDIFF', Sequelize.col('close_date'), Sequelize.col('db_opportunity.createdAt')), 'days_difference'],
            ],
            include: [
                {
                    model: req.config.users,
                    as: 'assignedOpp',
                    attributes: ['user_id', 'user']
                }
            ],
            group: ['assigned_to', 'db_opportunity.opp_id'],
            raw: true
        });

        // Group by assigned_to
        const groupedData = opportunities.reduce((acc, curr) => {
            const { assigned_to, days_difference } = curr;

            // Check if days_difference is less than 0
            if (days_difference < 0) {
                return acc; // Skip this entry if days_difference is less than 0
            }

            const assignedToUser = curr['assignedOpp.user'];
            const userId = curr['assignedOpp.user_id'];

            if (!acc[assigned_to]) {
                acc[assigned_to] = {
                    assigned_to: { user_id: userId, user: assignedToUser },
                    opportunities: [],
                    totalDays: 0,
                    totalOpportunities: 0
                };
            }

            acc[assigned_to].opportunities.push({ days_difference });
            acc[assigned_to].totalDays += days_difference;
            acc[assigned_to].totalOpportunities += 1;

            return acc;
        }, {});

        // Calculate average days difference for each assigned_to
        const result = Object.values(groupedData).map(assigned => {
            return {
                assigned_to: assigned.assigned_to,
                average_days_difference: assigned.totalDays / assigned.totalOpportunities
            };
        });

        // Send the response
        return await responseSuccess(req, res, "Average closing time by assigned_to", result);

    } catch (error) {
        logErrorToFile(error);
        console.log(error);
        return await responseError(req, res, "Something Went Wrong");
    }
};

// exports.getAverageClosingTime = async (req, res) => {
//     try {
//         let whereClause = {};

//         // Filter based on user role
//         if (!req.user.isDB) {
//             whereClause = {
//                 ...whereClause,
//                 [Op.or]: [
//                     { opp_owner: req.user.user_id },
//                     { assigned_to: req.user.user_id }
//                 ]
//             };
//         }

//         // Fetch average days_difference directly in SQL
//         const results = await req.config.opportunities.findAll({
//             where: whereClause,
//             attributes: [
//                 'assigned_to',
//                 [Sequelize.fn('AVG', Sequelize.fn('DATEDIFF', Sequelize.col('close_date'), Sequelize.col('db_opportunity.createdAt'))), 'average_days_difference']
//             ],
//             include: [
//                 {
//                     model: req.config.users,
//                     as: 'assignedOpp',
//                     attributes: ['user_id', 'user']
//                 }
//             ],
//             group: ['assigned_to', 'assignedOpp.user_id', 'assignedOpp.user'],
//             raw: true
//         });

//         // Format the response
//         const formattedResponse = results.map(result => ({
//             assigned_to: {
//                 user_id: result['assignedOpp.user_id'],
//                 user: result['assignedOpp.user']
//             },
//             average_days_difference: parseFloat(result.average_days_difference)
//         }));

//         // Send the response
//         return await responseSuccess(req, res, "Average closing time by assigned_to", formattedResponse);

//     } catch (error) {
//         logErrorToFile(error);
//         console.log(error);
//         return await responseError(req, res, "Something Went Wrong");
//     }
// };

// exports.getAverageClosingTime = async (req, res) => {
//     try {
//         let whereClause = {};

//         // Filter based on user role
//         if (!req.user.isDB) {
//             whereClause = {
//                 ...whereClause,
//                 [Op.or]: [
//                     { opp_owner: req.user.user_id },
//                     { assigned_to: req.user.user_id }
//                 ]
//             };
//         }

//         // Fetch opportunities with close_date and createdAt, and include the assigned user data
//         const opportunities = await req.config.opportunities.findAll({
//             where: whereClause,
//             include: [
//                 {
//                     model: req.config.users,
//                     as: 'assignedOpp', // Assuming 'assignedOpp' is the alias for the user model associated with assigned_to
//                     attributes: ['user_id', 'user'], // Add other attributes you need
//                     paranoid: false
//                 }
//             ]
//         });

//         // Group the opportunities by assigned_to
//         const groupedOpportunities = opportunities.reduce((result, opportunity) => {
//             const assignedTo = opportunity.assigned_to;

//             // Ensure assigned_to data is included
//             const assignedUser = opportunity.assignedOpp ? {
//                 user_id: opportunity.assignedOpp.user_id,
//                 user: opportunity.assignedOpp.user
//             } : null;

//             if (!result[assignedTo]) {
//                 result[assignedTo] = {
//                     assigned_to: assignedUser,
//                     opportunities: []
//                 };
//             }
//             result[assignedTo].opportunities.push(opportunity);
//             return result;
//         }, {});

//         // Convert the result object into an array
//         const response = Object.values(groupedOpportunities);

//         // Send the response
//         return await responseSuccess(req, res, "Average closing time by assigned_to", response);

//     } catch (error) {
//         logErrorToFile(error);
//         console.log(error);
//         return await responseError(req, res, "Something Went Wrong");
//     }
// };
