const { Sequelize, DataTypes, QueryTypes, where, Op } = require("sequelize");
const {responseError, responseSuccess} = require('../helper/responce')


exports.storeLeadRating = async(req, res) =>{
    try {
        let {lead_rate_name} = req.body
        let leadRateData;

        leadRateData = await req.config.leadRatings.findOne({where:{rating : lead_rate_name
        }})

        if(leadRateData)   return await responseError(req, res, "lead rate name already exist")
     
            let count  = await req.config.leadRatings.count({ paranoid: false })
            let body = {
                rating: lead_rate_name,
                lead_rate_code: `LR_${count+1}`,
                status: true
            }
            leadRateData =  await req.config.leadRatings.create(body)
            return await responseSuccess(req, res, "rating created Succesfully", leadRateData )
       
    } catch (error) {
    logErrorToFile(error)
        return await responseError(req, res, "Something Went Wrong")
    }
}

exports.getLeadRating = async(req, res) =>{
    try {
        let leadRateData = await req.config.leadRatings.findAll()
        return await responseSuccess(req, res, "rating list", leadRateData)
       
    } catch (error) {
    logErrorToFile(error)
        return await responseError(req, res, "Something Went Wrong")
    }
}


exports.editLeadRating = async(req, res) =>{
    try {

        let {lead_rate_name , lead_rate_id, lead_rate_code} = req.body
        let body = req.body
        if(lead_rate_name){
            body.rating = lead_rate_name
        let leadRateData = await req.config.leadRatings.findOne({
            where:{
                lead_rate_code: {[Op.ne]: lead_rate_code},
                rating: lead_rate_name
            }
        })
        if(leadRateData) return await responseError(req, res, "rating name already existed") 
        }
            await req.config.leadRatings.update(body, {
                where:{
                    lead_rate_id: lead_rate_id
                }
            })
            return await responseSuccess(req, res, "rating updated")

    } catch (error) {
    logErrorToFile(error)
        return await responseError(req, res, "Something Went Wrong")
    }
}


exports.deleteLeadRating = async(req, res) =>{
    try {

        let {lr_id} = req.query
        let leadRateData = await req.config.leadRatings.findOne({
            where:{
                lead_rate_id: lr_id,
            }
        })

        if(!leadRateData) return await responseError(req, res, "rating name does not existed") 
        await leadRateData.destroy()
        return await responseSuccess(req, res, "rating deleted")

    } catch (error) {
    logErrorToFile(error)
        console.log(error)
        return await responseError(req, res, "Something Went Wrong")
    }
}