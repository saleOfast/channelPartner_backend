const { Sequelize, DataTypes, QueryTypes, where, Op } = require("sequelize");
const { responseError, responseSuccess } = require('../helper/responce');
const { read } = require("xlsx");
const { config } = require("dotenv");



exports.storeLeadCalls = async (req, res) => {
    try {
        let callLogBody = req.body
        let CallData;
        let count = await req.config.callLogs.count({ paranoid: false })
        callLogBody.cts_no = `CTS_00${count + 1}`;
        CallData = await req.config.callLogs.create(callLogBody)
        return await responseSuccess(req, res, "call log created Succesfully", CallData)

    } catch (error) {
        logErrorToFile(error)
        console.log(error);
        return await responseError(req, res, "Something Went Wrong")
    }
}

exports.getLeadCallLogs = async (req, res) => {
    try {

        let whereCLause = {}
        if (req.query.l_id) {
            whereCLause.lead_id = req.query.l_id
        }
        if (req.query.link_with_opportunity) {
            whereCLause.link_with_opportunity = req.query.link_with_opportunity
        }
        let CallData = await req.config.callLogs.findAll({
            where: whereCLause,
            include: [
                {
                    model: req.config.leads,
                    paranoid: false
                },
                {
                    model: req.config.opportunities,
                    attributes: ['opp_id', "opp_name"],
                    paranoid: false
                }

            ],
            order: [
                ['call_lead_id', 'DESC']
            ]
        })

        return await responseSuccess(req, res, "call log list", CallData)

    } catch (error) {
        logErrorToFile(error)
        console.log(error);
        return await responseError(req, res, "Something Went Wrong")
    }
}

exports.getSingleEvent = async (req, res) => {

    try {
        const { event_id } = req.query;

        const eventlead = await req.config.callLogs.findByPk(event_id);

        if (!eventlead) return res.status(404).json({ message: "event not found" });
        return await responseSuccess(req, res, "event detail", eventlead)
    } catch (error) {
        logErrorToFile(error)
        console.error(error);
        return await responseError(req, res, "Something Went Wrong")
    }
};


exports.editEvent = async (req, res) => {

    try {
        const eventData = req.body
        const updatedEvent = await req.config.callLogs.update(eventData, {
            where: {
                call_lead_id: eventData.call_lead_id,
            },
        });
        return await responseSuccess(req, res, "event updated", updatedEvent)
    } catch (error) {
        logErrorToFile(error)
        console.error(error);
        return await responseError(req, res, "Something Went Wrong")
    }
};


exports.deleteEvent = async (req, res) => {
    try {
        const { event_id } = req.query;

        const eventlead = await req.config.callLogs.findByPk(event_id);

        if (!eventlead) return res.status(404).json({ message: "event not found" });

        await eventlead.destroy()
        return await responseSuccess(req, res, "event deleted")
    } catch (error) {
        logErrorToFile(error)
        console.error(error);
        return await responseError(req, res, "Something Went Wrong")
    }
};
