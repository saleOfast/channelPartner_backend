const { Sequelize, DataTypes, QueryTypes, where, Op } = require("sequelize");

exports.responseSuccess = async (req, res, message, data = null, t = null) => {
    // await req.config.sequelize.close();
    return res.status(200).json({
        status: 200,
        message,
        data,
    });
};

exports.responseError = async (req, res, message, data = null, t = null) => {
    // await req.config.sequelize.close();
    return res.status(400).json({
        status: 400,
        message,
        data,
    });
};

exports.responseSuccessPaginate = async (
    req,
    res,
    message,
    data = null,
    totalCount,
    totalPages,
    currentPage,
    pageSize
) => {

    return res.status(200).json({
        status: 200,
        message,
        data,
        totalCount,
        totalPages,
        currentPage,
        pageSize,
    });
};

exports.getEstimateCode = (req, type) => {
    const today = new Date();
    const month = String(today.getMonth() + 1).padStart(2, '0'); // Get current month and pad with '0' if needed
    const year = today.getFullYear();
    let base, obj
    if (type == 'estimate') {
        base = 'CE'
        obj = req.config.estimations
    }
    if (type == 'campaign') {
        base = 'CP'
        obj = req.config.mediaCampaignManagement
    }
    if (type == 'po') {
        base = 'PI'
        obj = req.config.purchaseOrders
    }
    // Determine the financial year
    let startYear, endYear;
    if (month >= 4) {
        startYear = year % 100;
        endYear = (year + 1) % 100;
    } else {
        startYear = (year - 1) % 100;
        endYear = year % 100;
    }
    const financialYear = `${startYear}-${endYear}`;

    // Fetch the count of estimates for the current month and year
    return obj.count({
        where: {
            // Filters for estimates created in the current month and year
            createdAt: {
                [Op.gte]: new Date(year, today.getMonth(), 1),     // From the 1st of the current month
                [Op.lt]: new Date(year, today.getMonth() + 1, 1)   // Until the 1st of the next month
            }
        }
    }).then(estimationCount => {
        // Increment estimation number
        const estimateNumber = estimationCount + 1;

        // Create the estimation number in the format CEn/mm/yy-yy
        return `${base + estimateNumber}/${month}/${financialYear}`;
    }).catch(err => {
        console.error('Error counting estimations:', err);
        throw err;
    });
}