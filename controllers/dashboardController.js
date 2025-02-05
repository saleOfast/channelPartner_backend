const { Sequelize, DataTypes, QueryTypes, where, Op } = require("sequelize");
const { responseError, responseSuccess } = require('../helper/responce')
const moment = require("moment");
const { required } = require("joi");
const db = require("../model");

const Client = db.clients;

exports.getContact = async (req, res) => {
    try {
        let startDate = req.query.startDate;
        let endDate = req.query.endDate
        let leads;
        let openLead
        let accounts
        let whereClause = {};
        let whereTaskClause = {};
        let whereTask = {};
        let whereOpprAmount = {};

        if (req.query.type === 'all') {
            endDate = moment(new Date(endDate)).add(1, "d").toDate().toISOString().split('T')[0];
        }

        if (!req.user.isDB) {
            whereClause = {
                opp_owner: req.user.user_id
            }
            whereTaskClause = {
                assigned_to: req.user.user_id
            }

            whereOpprAmount = {
                assigned_to: req.user.user_id
            }

            whereTask = {
                [Op.or]: [
                    { assigned_to: req.user.user_id },
                    { created_by: req.user.user_id }
                ],
            }
        }


        leads = await req.config.leads.count({
            where: {
                createdAt: {
                    [Op.between]: [startDate, endDate],
                },
            },
        })

        openLead = await req.config.leads.count({
            where: {
                createdAt: {
                    [Op.between]: [startDate, endDate],
                },
                lead_status_id: 1
            },
        })

        accounts = await req.config.accounts.count({
            where: {
                createdAt: {
                    [Op.between]: [startDate, endDate],
                },
            },
        })

        let task = await req.config.tasks.count({
            where: {

                ...whereTask,
                createdAt: {
                    [Op.between]: [startDate, endDate],
                },
                task_status_id: 1
            },
        })

        let opportunities = await req.config.opportunities.count({
            where: {
                createdAt: {
                    [Op.between]: [startDate, endDate],
                },
            },
        })


        let opportunitiesCostResult = await req.config.opportunities.findAll({
            where: {
                ...whereOpprAmount,
                opportunity_stg_id: {
                    [Op.ne]: 4
                },
                createdAt: {
                    [Op.between]: [startDate, endDate],
                },
            },
            attributes: [[Sequelize.fn("SUM", Sequelize.col("amount")), "totalAmount"]],
            raw: true
        });

        // now it it act as  opportunities cost 
        let quotationCostResult = await req.config.opportunities.findAll({
            where: {
                ...whereOpprAmount,
                opportunity_stg_id: 3,
                createdAt: {
                    [Op.between]: [startDate, endDate],
                },
            },
            attributes: [[Sequelize.fn("SUM", Sequelize.col("amount")), "totalGrandTotal"]],
            raw: true
        });


        let topOpportunities = await req.config.opportunities.findAll({
            where: whereClause,
            order: [
                ['amount', 'DESC'],],
            limit: 5
        })

        latestTasks = await req.config.tasks.findAll({
            where: { task_status_id: { [Op.in]: [1] } },
            attributes: [
                'task_id',
                'task_name',
                'task_status_id',
                'task_priority_id',
                'link_with_opportunity',
                'due_date',
                "assigned_to",
                "created_by",
                "description",
                "createdAt",
                "updatedAt",
                "deletedAt",
                [req.config.sequelize.literal(`DATEDIFF(due_date, NOW())`), 'days_left']
            ],
            order: [
                ['due_date', 'DESC'],
            ],
            limit: 5
        })

        let query = rangewise(req.query.type, startDate, endDate)

        let barchart = await req.config.sequelize.query(query, {
            type: QueryTypes.SELECT,
        })


        let piechart = await req.config.sequelize.query(`SELECT dbl.status_name as 'name', COUNT(ld.lead_status_id) AS 'value' FROM db_lead_statuses AS dbl LEFT JOIN db_leads AS ld ON dbl.lead_status_id = ld.lead_status_id WHERE ld.deletedAt IS NULL AND ld.createdAt BETWEEN '${startDate}' AND '${endDate}' GROUP BY dbl.lead_status_id, dbl.status_name;`, {
            type: QueryTypes.SELECT,
        })

        let piechartOpp = await req.config.sequelize.query(`
        SELECT 
            CASE 
                WHEN dos.opportunity_stg_name = 'Open' THEN 'Open'
                WHEN dos.opportunity_stg_name = 'In Progress' THEN 'In discussion'
                WHEN dos.opportunity_stg_name = 'Closed Won' THEN 'Waiting for client'
                ELSE dos.opportunity_stg_name
            END AS 'name', 
            COUNT(do.opportunity_stg_id) AS 'value'
        FROM 
            db_opportunity_stgs AS dos
        LEFT JOIN 
            db_opportunities AS do 
        ON 
            dos.opportunity_stg_id = do.opportunity_stg_id
            AND do.deletedAt IS NULL
            AND do.createdAt BETWEEN '${startDate}' AND '${endDate}'
        WHERE 
            dos.opportunity_stg_id IN (1, 2, 3)
        GROUP BY 
            dos.opportunity_stg_id, 
            dos.opportunity_stg_name
        HAVING 
            COUNT(do.opportunity_stg_id) > 0;
        `, {
            type: QueryTypes.SELECT,
        })

        let piechartOppAmount = await req.config.sequelize.query(`
        SELECT 
            CASE 
                WHEN dos.opportunity_stg_name = 'Open' THEN 'Open'
                WHEN dos.opportunity_stg_name = 'In Progress' THEN 'In discussion'
                WHEN dos.opportunity_stg_name = 'Closed Won' THEN 'Waiting for client'
                ELSE dos.opportunity_stg_name
            END AS 'name', 
            COALESCE(SUM(do.amount), 0) AS 'value'
        FROM 
            db_opportunity_stgs AS dos
        LEFT JOIN 
            db_opportunities AS do 
        ON 
            dos.opportunity_stg_id = do.opportunity_stg_id
            AND do.deletedAt IS NULL
            AND do.createdAt BETWEEN '${startDate}' AND '${endDate}'
        WHERE 
            dos.opportunity_stg_id IN (1, 2, 3)
        GROUP BY 
            dos.opportunity_stg_id, 
            dos.opportunity_stg_name
        HAVING 
            SUM(do.amount) > 0;
        `, {
            type: QueryTypes.SELECT,
        })

        piechartOppAmount = piechartOppAmount.map((item) => ({
            name: item.name,
            value: Number(item.value)
        }));

        let opportunitiesCost = opportunitiesCostResult[0].totalAmount || 0;
        let quotationCost = quotationCostResult[0].totalGrandTotal || 0;

        let dashboard = {
            leads,
            openLead,
            accounts,
            task,
            latestTasks,
            opportunities,
            topOpportunities,
            opportunitiesCost,
            quotationCost,
            barchart,
            piechart,
            piechartOpp,
            piechartOppAmount,
        }
        return await responseSuccess(req, res, "lead Count", dashboard)


    } catch (error) {
        logErrorToFile(error)
        console.log(error)
        return await responseError(req, res, "Something Went Wrong")
    }
}

exports.getPlatformPermissionCount = async (req, res) => {
    try {
        let data = await req.config.userPlatform.findAll({
            where: {
                actions: true
            },

            group: ['platform_id']
        });
        return await responseSuccess(req, res, "dashboard", data)

    } catch (error) {
        logErrorToFile(error)
        console.log(error)
        return await responseError(req, res, "Something Went Wrong")
    }
}

const rangewise = (type, startDate, endDate) => {

    switch (type) {
        case "weekly":

            return `SELECT
            DATE(date) as 'date',
            COUNT(leadId) AS 'lead',
            COUNT(oppId) AS 'opportunity'
        FROM (
            SELECT
                ld.createdAt AS date,
                ld.lead_id AS leadId,
                NULL AS oppId
            FROM
                db_leads ld
            WHERE
                ld.createdAt BETWEEN '${startDate}' AND '${endDate}'  and ld.deletedAt IS null
            
            UNION ALL
            
            SELECT
                od.createdAt AS date,
                NULL AS leadId,
                od.opp_id AS oppId
            FROM
                db_opportunities od
            WHERE
                od.createdAt BETWEEN  '${startDate}' AND '${endDate}'   and od.deletedAt IS null
        ) AS combinedData
        GROUP BY
            DATE(date)
        ORDER BY
            DATE(date);`

        case "monthly":

            return `SELECT
            CONCAT('week ', WEEK(date, 1) - WEEK(DATE_SUB(date, INTERVAL DAYOFMONTH(date) - 1 DAY), 1) + 1) AS 'date',
            COUNT(leadId) AS 'lead',
            COUNT(oppId) AS 'opportunity'
        FROM (
            SELECT
                ld.createdAt AS date,
                ld.lead_id AS leadId,
                NULL AS oppId
            FROM
                db_leads ld
            WHERE
                ld.createdAt BETWEEN  '${startDate}' AND '${endDate}' AND ld.deletedAt IS NULL
                
            UNION ALL
            
            SELECT
                od.createdAt AS date,
                NULL AS leadId,
                od.opp_id AS oppId
            FROM
                db_opportunities od
            WHERE
                od.createdAt BETWEEN  '${startDate}' AND '${endDate}' AND od.deletedAt IS NULL
        ) AS combinedData
        GROUP BY
            WEEK(date, 1) - WEEK(DATE_SUB(date, INTERVAL DAYOFMONTH(date) - 1 DAY), 1) + 1
        ORDER BY
            MIN(date)`

        case "all":

            return `SELECT
            CONCAT(YEAR(date), '-', LEFT(MONTHNAME(date), 3)) AS 'date',
            COUNT(leadId) AS 'lead',
            COUNT(oppId) AS 'opportunity'
        FROM (
            SELECT
                ld.createdAt AS date,
                ld.lead_id AS leadId,
                NULL AS oppId
            FROM
                db_leads ld
            WHERE
                ld.createdAt BETWEEN '2023-01-01' AND '${endDate}' AND ld.deletedAt IS NULL
                
            UNION ALL
            
            SELECT
                od.createdAt AS date,
                NULL AS leadId,
                od.opp_id AS oppId
            FROM
                db_opportunities od
            WHERE
                od.createdAt BETWEEN '2023-01-01' AND '${endDate}' AND od.deletedAt IS NULL
        ) AS combinedData
        GROUP BY
            YEAR(date), MONTH(date)
        ORDER BY
            MIN(date)`

        default:

            return `SELECT
            CONCAT(YEAR(date), '-', LEFT(MONTHNAME(date), 3)) AS 'date',
            COUNT(leadId) AS 'lead',
            COUNT(oppId) AS 'opportunity'
        FROM (
            SELECT
                ld.createdAt AS date,
                ld.lead_id AS leadId,
                NULL AS oppId
            FROM
                db_leads ld
            WHERE
                ld.createdAt BETWEEN '2023-01-01' AND '${endDate}' AND ld.deletedAt IS NULL
                
            UNION ALL
            
            SELECT
                od.createdAt AS date,
                NULL AS leadId,
                od.opp_id AS oppId
            FROM
                db_opportunities od
            WHERE
                od.createdAt BETWEEN '2023-01-01' AND '${endDate}' AND od.deletedAt IS NULL
        ) AS combinedData
        GROUP BY
            YEAR(date), MONTH(date)
        ORDER BY
            MIN(date)`
    }
}


exports.getPlatformPermissionCount = async (req, res) => {
    try {
        let getData = await req.config.platform.findAll({
            attributes: ['platform_name', 'platform_id', 'is_active'],

            include: [
                {
                    model: req.config.userPlatform,

                    attributes: ["platform_id", "user_id", "actions",
                        [req.config.sequelize.fn('count', req.config.sequelize.col('db_user_platforms.platform_id')), 'usedLicences'],

                    ],
                    where: {
                        actions: true
                    },

                    required: false,

                },
            ],
            group: ['platform_id']
        })

        let userAdminSubscriptionData = await Client.findOne({
            attributes: ['subscription_start_date', 'subscription_end_date', 'subscription_start_date_channel', 'subscription_end_date_channel', 'subscription_start_date_dms', 'subscription_end_date_dms', 'subscription_start_date_sales', 'subscription_end_date_sales'],
            where: {
                isDB: 1,
                db_name: req.admin.db_name
            },
        });

        let newData = getData?.map((item) => {
            if (item.dataValues.platform_name === 'CRM') {
                item.dataValues.subscription_start_date = userAdminSubscriptionData.subscription_start_date
                item.dataValues.subscription_end_date = userAdminSubscriptionData.subscription_end_date
            }

            if (item.dataValues.platform_name === 'DMS') {
                item.dataValues.subscription_start_date_dms = userAdminSubscriptionData.subscription_start_date_dms
                item.dataValues.subscription_end_date_dms = userAdminSubscriptionData.subscription_end_date_dms
            }

            if (item.dataValues.platform_name === 'SALES') {
                item.dataValues.subscription_start_date_sales = userAdminSubscriptionData.subscription_start_date_sales
                item.dataValues.subscription_end_date_sales = userAdminSubscriptionData.subscription_end_date_sales
            }

            if (item.dataValues.platform_name === 'CHANNEL') {
                item.dataValues.subscription_start_date_channel = userAdminSubscriptionData.subscription_start_date_channel
                item.dataValues.subscription_end_date_channel = userAdminSubscriptionData.subscription_end_date_channel
            }
            return item.dataValues
        })

        return await responseSuccess(req, res, "getData Count", newData)
    } catch (error) {
        logErrorToFile(error)
        console.log(error)
        return await responseError(req, res, "Something Went Wrong")
    }
}


exports.getPlatformPermissionCountReverse = async (req, res) => {
    try {
        let getData = await req.config.userPlatform.findAll({
            attributes: ['platform_id', 'actions', 'user_id',
                [req.config.sequelize.fn('count', req.config.sequelize.col('user_id')), 'usedLicences'],

            ],
            where: {
                actions: true
            },
            include: [
                {
                    model: req.config.platform,
                    attributes: ["platform_name", "is_active"],

                },

            ],
            group: ['platform_id']
        })

        return await responseSuccess(req, res, "getData Count", getData)
    } catch (error) {
        logErrorToFile(error)
        console.log(error)
        return await responseError(req, res, "Something Went Wrong")
    }
}