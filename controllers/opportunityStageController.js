const { Sequelize, DataTypes, QueryTypes, where, Op } = require("sequelize");
const {responseError, responseSuccess} = require('../helper/responce')


exports.storeOppStg = async(req, res) =>{
    try {
        let {opportunity_stg_name} = req.body
        let OppStgData;

        OppStgData = await req.config.opprStage.findOne({where:{opportunity_stg_name : opportunity_stg_name
        }})

        if(OppStgData)   return await responseError(req, res, "opportunity stage name already exist")
     
            let count  = await req.config.opprStage.count({ paranoid: false })
            let body = {
                opportunity_stg_name: opportunity_stg_name,
                opportunity_stg_code: `OP_${count+1}`,
                status: true
            }
            OppStgData =  await req.config.opprStage.create(body)
            return await responseSuccess(req, res, "opportunity stage created Succesfully", OppStgData )
       
    } catch (error) {
    logErrorToFile(error)
        return await responseError(req, res, "Something Went Wrong")
    }
}

exports.getOppStg = async(req, res) =>{
    try {
        let OppStgData = await req.config.opprStage.findAll()
        return await responseSuccess(req, res, "opportunity stage list", OppStgData)
       
    } catch (error) {
    logErrorToFile(error)
        return await responseError(req, res, "Something Went Wrong")
    }
}


exports.editOppStg = async(req, res) =>{
    try {

        let {opportunity_stg_name , opportunity_stg_id, opportunity_stg_code} = req.body
        let body = req.body
        if(opportunity_stg_name){
            let OppStgData = await req.config.opprStage.findOne({
                where:{
                    opportunity_stg_code: {[Op.ne]: opportunity_stg_code},
                    opportunity_stg_name: opportunity_stg_name
                }
            })
    
            if(OppStgData) return await responseError(req, res, "opportunity stage name already existed") 
        }
        
            await req.config.opprStage.update(body, {
                where:{
                    opportunity_stg_id: opportunity_stg_id
                }
            })
            return await responseSuccess(req, res, "opportunity stage updated")

    } catch (error) {
    logErrorToFile(error)
        return await responseError(req, res, "Something Went Wrong")
    }
}


exports.deleteOppStg = async(req, res) =>{
    try {
        let {opp_id} = req.query
        let OppStgData = await req.config.opprStage.findOne({
            where:{
                opportunity_stg_id: opp_id,
            }
        })

        if(!OppStgData) return await responseError(req, res, "opportunity stage name does not existed") 
        await OppStgData.destroy()
        return await responseSuccess(req, res, "opportunity stage deleted")

    } catch (error) {
    logErrorToFile(error)
        console.log(error)
        return await responseError(req, res, "Something Went Wrong")
    }
}