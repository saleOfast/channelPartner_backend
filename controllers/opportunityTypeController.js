const { Sequelize, DataTypes, QueryTypes, where, Op } = require("sequelize");
const {responseError, responseSuccess} = require('../helper/responce')


exports.storeOppType = async(req, res) =>{
    try {
        let {opportunity_type_name} = req.body
        let oppTypeData;

        oppTypeData = await req.config.opprType.findOne({where:{opportunity_type_name : opportunity_type_name
        }})

        if(oppTypeData)   return await responseError(req, res, "opportunity type name already exist")
     
            let count  = await req.config.opprType.count({ paranoid: false })
            let body = {
                opportunity_type_name: opportunity_type_name,
                opportunity_type_code: `OPT_${count+1}`,
                status: true
            }
            oppTypeData =  await req.config.opprType.create(body)
            return await responseSuccess(req, res, "opportunity type created Succesfully", oppTypeData )
       
    } catch (error) {
    logErrorToFile(error)
        return await responseError(req, res, "Something Went Wrong")
    }
}

exports.getOppType = async(req, res) =>{
    try {
        let oppTypeData = await req.config.opprType.findAll()
        return await responseSuccess(req, res, "opportunity type list", oppTypeData)
       
    } catch (error) {
    logErrorToFile(error)
        return await responseError(req, res, "Something Went Wrong")
    }
}


exports.editOppType = async(req, res) =>{
    try {

        let {opportunity_type_name , opportunity_type_id, opportunity_type_code} = req.body
        let body = req.body
        if(opportunity_type_name){
            let oppTypeData = await req.config.opprType.findOne({
                where:{
                    opportunity_type_code: {[Op.ne]: opportunity_type_code},
                    opportunity_type_name: opportunity_type_name
                }
            })
    
            if(oppTypeData) return await responseError(req, res, "opportunity type name already existed") 
        }
        
            await req.config.opprType.update(body, {
                where:{
                    opportunity_type_id: opportunity_type_id
                }
            })
            return await responseSuccess(req, res, "opportunity type updated")

    } catch (error) {
    logErrorToFile(error)
        return await responseError(req, res, "Something Went Wrong")
    }
}


exports.deleteOppType = async(req, res) =>{
    try {
        let {opt_id} = req.query
        let oppTypeData = await req.config.opprType.findOne({
            where:{
                opportunity_type_id: opt_id,
            }
        })

        if(!oppTypeData) return await responseError(req, res, "opportunity type name does not existed") 
        await oppTypeData.destroy()
        return await responseSuccess(req, res, "opportunity type deleted")

    } catch (error) {
    logErrorToFile(error)
        console.log(error)
        return await responseError(req, res, "Something Went Wrong")
    }
}