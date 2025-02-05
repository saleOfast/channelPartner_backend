const { Sequelize, DataTypes, QueryTypes, where, Op } = require("sequelize");
const {responseError, responseSuccess} = require('../helper/responce')


exports.storeLeadType = async(req, res) =>{
    try {
        let {type_name} = req.body
        let leadTypeData;

        leadTypeData = await req.config.leadTypes.findOne({where:{type : type_name
        }})

        if(leadTypeData)   return await responseError(req, res, "type_name already exist")
     
            let count  = await req.config.leadTypes.count({ paranoid: false })
            let body = {
                type: type_name,
                lead_type_code: `TP_${count+1}`,
                status: true
            }
            leadTypeData =  await req.config.leadTypes.create(body)
            return await responseSuccess(req, res, "type created Succesfully", leadTypeData )
       
    } catch (error) {
    logErrorToFile(error)
        return await responseError(req, res, "Something Went Wrong")
    }
}

exports.getLeadType = async(req, res) =>{
    try {
        let leadTypeData = await req.config.leadTypes.findAll()
        return await responseSuccess(req, res, "type list", leadTypeData)
       
    } catch (error) {
    logErrorToFile(error)
        return await responseError(req, res, "Something Went Wrong")
    }
}


exports.editLeadType = async(req, res) =>{
    try {

        let {type_name , lead_type_id, lead_type_code} = req.body
        let body = req.body
        if(type_name){
            body.type = type_name
            let leadTypeData = await req.config.leadTypes.findOne({
                where:{
                    lead_type_code: {[Op.ne]: lead_type_code},
                    type: type_name
                }
            })
    
            if(leadTypeData) return await responseError(req, res, "type name already existed") 
        }
        
            await req.config.leadTypes.update(body, {
                where:{
                    lead_type_id: lead_type_id
                }
            })
            return await responseSuccess(req, res, "type updated")

    } catch (error) {
    logErrorToFile(error)
        return await responseError(req, res, "Something Went Wrong")
    }
}


exports.deleteLeadType = async(req, res) =>{
    try {

        let {type_id} = req.query
        let leadTypeData = await req.config.leadTypes.findOne({
            where:{
                lead_type_id: type_id,
            }
        })

        if(!leadTypeData) return await responseError(req, res, "type name does not existed") 
        await leadTypeData.destroy()
        return await responseSuccess(req, res, "type deleted")

    } catch (error) {
    logErrorToFile(error)
        console.log(error)
        return await responseError(req, res, "Something Went Wrong")
    }
}