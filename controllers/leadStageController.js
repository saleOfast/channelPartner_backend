const { Sequelize, DataTypes, QueryTypes, where, Op } = require("sequelize");
const {responseError, responseSuccess} = require('../helper/responce')


exports.storeLeadStg = async(req, res) =>{
    try {
        let {stage_name} = req.body
        let leadStgData;

        leadStgData = await req.config.leadStages.findOne({where:{stage : stage_name
        }})

        if(leadStgData)   return await responseError(req, res, "stage_name already exist")
     
            let count  = await req.config.leadStages.count({ paranoid: false })
            let body = {
                stage: stage_name,
                lead_stg_code: `SG_${count+1}`,
                status: true
            }
            leadStgData =  await req.config.leadStages.create(body)
            return await responseSuccess(req, res, "stage created Succesfully", leadStgData )
       
    } catch (error) {
    logErrorToFile(error)
        return await responseError(req, res, "Something Went Wrong")
    }
}

exports.getLeadStg = async(req, res) =>{
    try {
        let leadStgData = await req.config.leadStages.findAll()
        return await responseSuccess(req, res, "stage list", leadStgData)
       
    } catch (error) {
    logErrorToFile(error)
        return await responseError(req, res, "Something Went Wrong")
    }
}


exports.editLeadStg = async(req, res) =>{
    try {
        let {stage_name , lead_stg_id, lead_stg_code} = req.body
        let body = req.body
        if(stage_name){
            body.stage = stage_name
            let leadStgData = await req.config.leadStages.findOne({
                where:{
                    lead_stg_code: {[Op.ne]: lead_stg_code},
                    stage: stage_name
                }
            })
            if(leadStgData) return await responseError(req, res, "stage name already existed") 
        }
        await req.config.leadStages.update(body, {
            where:{
                lead_stg_id: lead_stg_id
            }
        })
        return await responseSuccess(req, res, "stage updated")

    } catch (error) {
    logErrorToFile(error)
        return await responseError(req, res, "Something Went Wrong")
    }
}


exports.deleteLeadStg = async(req, res) =>{
    try {

        let {stg_id} = req.query
        let leadStgData = await req.config.leadStages.findOne({
            where:{
                lead_stg_id: stg_id,
            }
        })

        if(!leadStgData) return await responseError(req, res, "stage name does not existed") 
        await leadStgData.destroy()
        return await responseSuccess(req, res, "stage deleted")

    } catch (error) {
    logErrorToFile(error)
        console.log(error)
        return await responseError(req, res, "Something Went Wrong")
    }
}