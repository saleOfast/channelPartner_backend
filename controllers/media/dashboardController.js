const { Sequelize, DataTypes, QueryTypes, where, Op } = require("sequelize");
const { responseError, responseSuccess } = require("../../helper/responce");
const moment = require('moment'); // Use moment.js for easier date manipulation

exports.getSalesOrder = async (req, res) => {
    try {
        const { financialYear, type } = req.query;
        let whereClause = {};
        let typeClause = {};

        if (!req.user.isDB) {
            const reportingUser = await req.config.users.findAll({
                where: { report_to: req.user.user_id },
                attributes: ['user_id']
            })

            const userIds = reportingUser.map(user => user.user_id);

            whereClause.created_by = { [Op.in]: userIds }
        }

        if (financialYear) {
            const startOfYear = moment(`${financialYear}-04-01`).startOf('day');
            const endOfYear = moment(`${parseInt(financialYear) + 1}-03-31`).endOf('day');
            whereClause.createdAt = { [Op.between]: [startOfYear.toDate(), endOfYear.toDate()] };
        }

        if (type) {
            typeClause.cmpn_b_t_id = type;  // type: { 1: 'Asset', 2: 'Agency' }
        }

        const data = await req.config.salesOrder.findAll({
            where: whereClause,
            include: [
                {
                    model: req.config.mediaCampaignManagement, paranoid: false,
                    attributes: ['cmpn_b_t_id'],
                    where: typeClause
                },
            ],
            attributes: [
                [Sequelize.fn('YEAR', Sequelize.col('db_sales_orders.createdAt')), 'year'],
                [Sequelize.fn('MONTH', Sequelize.col('db_sales_orders.createdAt')), 'month'],
                [Sequelize.fn('SUM', Sequelize.col('db_sales_orders.s_o_po_value')), 'total']
            ],
            group: ['year', 'month'],
            order: [
                [Sequelize.fn('YEAR', Sequelize.col('db_sales_orders.createdAt')), 'ASC'],
                [Sequelize.fn('MONTH', Sequelize.col('db_sales_orders.createdAt')), 'ASC']
            ]
        });

        //         const formattedData = data.map(record => ({
        //             month: `${moment().month(record.dataValues.month - 1).format("MMM")} ${record.dataValues.year}`,
        //             total: record.dataValues.total
        //         }));

        //         return await responseSuccess(req, res, "Data fetched successfully", formattedData);

        const startMonth = 4; // April
        const monthsOfYear = Array.from({ length: 12 }, (_, i) => ({
            month: moment().month((startMonth + i - 1) % 12).format("MMM"),
            year: (i + startMonth - 1 < 12) ? financialYear : parseInt(financialYear) + 1,
            total: 0
        }));

        data.forEach(record => {
            const monthIndex = (record.dataValues.month - startMonth + 12) % 12; // Map database month to monthsOfYear index
            monthsOfYear[monthIndex].total = parseFloat(record.dataValues.total);
        });

        return await responseSuccess(req, res, "Data fetched successfully", monthsOfYear);

    } catch (error) {
        logErrorToFile(error);
        console.error(error);
        return await responseError(req, res, "Something went wrong");
    }
};

exports.getSalesOrderByCreater = async (req, res) => {
    try {
        const { financialYear, type } = req.query;
        let whereClause = {};
        let typeClause = {};
        let userClause = { role_id: 5 };

        if (!req.user.isDB) {
            const reportingUser = await req.config.users.findAll({
                where: { report_to: req.user.user_id },
                attributes: ['user_id']
            });
            const userIds = reportingUser.map(user => user.user_id);
            whereClause.created_by = { [Op.in]: userIds };
        }

        if (financialYear) {
            const startOfYear = moment(`${financialYear}-04-01`).startOf('day');
            const endOfYear = moment(`${parseInt(financialYear) + 1}-03-31`).endOf('day');
            whereClause.createdAt = { [Op.between]: [startOfYear.toDate(), endOfYear.toDate()] };
        }

        if (type) {
            typeClause.cmpn_b_t_id = type;  // type: { 1: 'Asset', 2: 'Agency' }
        }

        if (!req.user.isDB) {
            userClause.report_to = req.user.user_id
        }

        const salesData = await req.config.salesOrder.findAll({
            where: whereClause,
            include: [
                {
                    model: req.config.mediaCampaignManagement,
                    where: typeClause,
                    attributes: ['cmpn_b_t_id'],
                    paranoid: false
                },
                {
                    model: req.config.users,
                    as: 'createdBySalesOrder',
                    attributes: ['user', 'user_l_name'],
                    paranoid: false
                },
            ],
            attributes: [
                'created_by',
                [Sequelize.fn('SUM', Sequelize.col('db_sales_orders.s_o_po_value')), 'total']
            ],
            group: ['created_by', 'createdBySalesOrder.user'],
            order: [[Sequelize.fn('SUM', Sequelize.col('db_sales_orders.s_o_po_value')), 'DESC']]
        });

        const allUsers = await req.config.users.findAll({
            where: userClause,
            attributes: ['user_id', 'user', 'user_l_name'],
            paranoid: false
        });

        const formattedData = allUsers.map(user => {
            const salesRecord = salesData.find(record => record.created_by === user.user_id);
            return {
                created_by: `${user.user} ${user.user_l_name ?? ''}`.trim(),
                total: salesRecord ? parseFloat(salesRecord.dataValues.total) : 0
            };
        });

        return await responseSuccess(req, res, "Data fetched successfully", formattedData);

    } catch (error) {
        logErrorToFile(error);
        console.error(error);
        return await responseError(req, res, "Something went wrong");
    }
};

exports.getPurchaseOrder = async (req, res) => {
    try {
        const { financialYear, type } = req.query;
        let whereClause = {};
        let typeClause = {};

        if (!req.user.isDB) {
            const reportingUser = await req.config.users.findAll({
                where: { report_to: req.user.user_id },
                attributes: ['user_id']
            })

            const userIds = reportingUser.map(user => user.user_id);

            whereClause.created_by = { [Op.in]: userIds }
        }

        if (financialYear) {
            const startOfYear = moment(`${financialYear}-04-01`).startOf('day');
            const endOfYear = moment(`${parseInt(financialYear) + 1}-03-31`).endOf('day');
            whereClause.createdAt = { [Op.between]: [startOfYear.toDate(), endOfYear.toDate()] };
        }

        if (type) {
            typeClause.cmpn_b_t_id = type;  // type: { 1: 'Asset', 2: 'Agency' }
        }

        const data = await req.config.purchaseOrders.findAll({
            where: whereClause,
            include: [
                {
                    model: req.config.mediaCampaignManagement, paranoid: false,
                    attributes: ['cmpn_b_t_id'],
                    where: typeClause
                },
            ],
            attributes: [
                [Sequelize.fn('YEAR', Sequelize.col('db_purchase_orders.createdAt')), 'year'],
                [Sequelize.fn('MONTH', Sequelize.col('db_purchase_orders.createdAt')), 'month'],
                [Sequelize.fn('SUM', Sequelize.col('db_purchase_orders.p_o_cost')), 'total']
            ],
            group: ['year', 'month'],
            order: [
                [Sequelize.fn('YEAR', Sequelize.col('db_purchase_orders.createdAt')), 'ASC'],
                [Sequelize.fn('MONTH', Sequelize.col('db_purchase_orders.createdAt')), 'ASC']
            ]
        });

        const startMonth = 4;
        const monthsOfYear = Array.from({ length: 12 }, (_, i) => ({
            month: moment().month((startMonth + i - 1) % 12).format("MMM"),
            year: (i + startMonth - 1 < 12) ? financialYear : parseInt(financialYear) + 1,
            total: 0
        }));

        data.forEach(record => {
            const monthIndex = (record.dataValues.month - startMonth + 12) % 12;
            monthsOfYear[monthIndex].total = parseFloat(record.dataValues.total);
        });

        return await responseSuccess(req, res, "Data fetched successfully", monthsOfYear);

    } catch (error) {
        logErrorToFile(error);
        console.error(error);
        return await responseError(req, res, "Something went wrong");
    }
};

exports.getSitesByAvailabiltyStatus = async (req, res) => {
    try {

        const allStatuses = await req.config.availabiltyStatus.findAll({
            attributes: ['a_s_id', 'a_s_name']
        });

        const siteCounts = await req.config.sites.findAll({
            attributes: [
                'a_s_id',
                [Sequelize.fn('COUNT', Sequelize.col('site_id')), 'count']
            ],
            group: ['a_s_id'],
            raw: true
        });

        const formattedData = allStatuses.map(status => {
            const count = siteCounts.find(item => item.a_s_id === status.a_s_id)?.count || 0;
            return {
                status: status.a_s_name,
                count: parseInt(count, 10)
            };
        });

        const totalSites = formattedData.reduce((sum, item) => sum + item.count, 0);

        const responseData = {
            totalSites,
            data: formattedData
        };

        return await responseSuccess(req, res, "Data fetched successfully", responseData);

    } catch (error) {
        logErrorToFile(error);
        console.error(error);
        return await responseError(req, res, "Something went wrong");
    }
};

exports.getSitesByCategory = async (req, res) => {
    try {

        const allCategories = await req.config.siteCategories.findAll({
            attributes: ['site_cat_id', 'site_cat_name']
        });

        const siteCounts = await req.config.sites.findAll({
            attributes: [
                'site_cat_id',
                [Sequelize.fn('COUNT', Sequelize.col('site_id')), 'count']
            ],
            group: ['site_cat_id'],
            raw: true
        });

        const formattedData = allCategories.map(category => {
            const count = siteCounts.find(item => item.site_cat_id === category.site_cat_id)?.count || 0;
            return {
                category: category.site_cat_name,
                count: parseInt(count, 10)
            };
        });

        const totalSites = formattedData.reduce((sum, item) => sum + item.count, 0);

        const responseData = {
            totalSites,
            data: formattedData
        };

        return await responseSuccess(req, res, "Data fetched successfully", responseData);

    } catch (error) {
        logErrorToFile(error);
        console.error(error);
        return await responseError(req, res, "Something went wrong");
    }
};
