const { Sequelize, DataTypes, QueryTypes, where, Op } = require("sequelize");
const { responseError, responseSuccess } = require('../helper/responce');
const { Json } = require("sequelize/lib/utils");

exports.getGeneralSettings = async (req, res) => {
    try {
        let data = await req.config.settings.findAll();
        return await responseSuccess(req, res, "Settings Lists Fetched Successfully", data)

    } catch (error) {
        logErrorToFile(error)
        return await responseError(req, res, "Something Went Wrong")
    }
}

exports.addGeneralSettings = async (req, res) => {
    try {
        const { setting_name, setting_value } = req.body
        let data = await req.config.settings.create({
            setting_name: setting_name,
            setting_value: setting_value
        })
        return await responseSuccess(req, res, "Settings Lists Fetched Successfully", data)

    } catch (error) {
        logErrorToFile(error)
        return await responseError(req, res, "Something Went Wrong")
    }
}

exports.editGeneralSettings = async (req, res) => {
    try {
        const { setting_id, setting_value } = req.body;

        let check = await req.config.settings.findOne({ where: { setting_id: setting_id } });

        if (!check) {
            return await responseError(req, res, "Settings Not Found");
        }

        if (setting_id == 3) {

            let inProcessEstimations = await req.config.estimations.findAll({
                where: {
                    approval_status: { [Op.ne]: 'APPROVED' }
                }
            })

            if (inProcessEstimations.length > 0) {
                return await responseError(req, res, `Cannot Update roles for approval. ${inProcessEstimations.length} estimates still under process`);
            }

            let newRoles = setting_value.split(',').map(item => parseInt(item.trim()));

            await req.config.estimateApprovals.update(
                { status: false },
                { where: {} }
            );

            await req.config.estimateApprovals.update(
                { status: true },
                { where: { role_id: { [Op.in]: newRoles } } }
            );
        }

        let data = await req.config.settings.update(
            { setting_value: setting_value },
            { where: { setting_id: setting_id } }
        );

        return await responseSuccess(req, res, "Settings Updated Successfully", data);

    } catch (error) {
        logErrorToFile(error);
        return await responseError(req, res, "Something Went Wrong");
    }
};

exports.getCurrencies = async (req, res) => {
    try {
        let data
        let { currency_id } = req.body

        if (currency_id) {
            data = await req.config.currency.findOne({ currency_id: currency_id })
        } else {
            data = await req.config.currency.findAll()
        }
        return res.status(200).json({ status: 404, message: "Data found successfully", data });

    } catch (error) {
        logErrorToFile(error)
        console.log(error);
        return res.status(400).json({ status: 400, message: "Something Went Wrong" });
    }
};
