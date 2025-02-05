const { Sequelize, DataTypes, QueryTypes, where, Op } = require("sequelize");
const { responseError, responseSuccess } = require('../helper/responce')


exports.storeLeadSrc = async (req, res) => {
    try {
        let { source_name } = req.body
        let leadSrcData;

        leadSrcData = await req.config.leadSources.findOne({
            where: {
                source: source_name
            }
        })

        if (leadSrcData) return await responseError(req, res, "source_name already exist")

        let count = await req.config.leadSources.count({ paranoid: false })
        let body = {
            source: source_name,
            lead_src_code: `SR_${count + 1}`,
            status: true
        }
        leadSrcData = await req.config.leadSources.create(body)
        return await responseSuccess(req, res, "source created Succesfully", leadSrcData)

    } catch (error) {
        logErrorToFile(error)
        return await responseError(req, res, "Something Went Wrong")
    }
}

exports.getLeadSrc = async (req, res) => {
    try {
        let leadSrcData = await req.config.leadSources.findAll()
        return await responseSuccess(req, res, "source list", leadSrcData)

    } catch (error) {
        logErrorToFile(error)
        return await responseError(req, res, "Something Went Wrong")
    }
}


exports.editLeadSrc = async (req, res) => {
    try {

        let { source_name, lead_src_id, lead_src_code } = req.body
        let body = req.body
        if (source_name) {
            body.source = source_name

            let leadSrcData = await req.config.leadSources.findOne({
                where: {
                    lead_src_code: { [Op.ne]: lead_src_code },
                    source: source_name
                }
            })

            if (leadSrcData) return await responseError(req, res, "source name already existed")
        }
        await req.config.leadSources.update(body, {
            where: {
                lead_src_id: lead_src_id
            }
        })
        return await responseSuccess(req, res, "source updated")

    } catch (error) {
        logErrorToFile(error)
        return await responseError(req, res, "Something Went Wrong")
    }
}


exports.deleteLeadSrc = async (req, res) => {
    try {

        let { sr_id } = req.query
        let leadSrcData = await req.config.leadSources.findOne({
            where: {
                lead_src_id: sr_id,
            }
        })

        if (!leadSrcData) return await responseError(req, res, "source name does not existed")
        await leadSrcData.destroy()
        return await responseSuccess(req, res, "source deleted")

    } catch (error) {
        logErrorToFile(error)
        console.log(error)
        return await responseError(req, res, "Something Went Wrong")
    }
}