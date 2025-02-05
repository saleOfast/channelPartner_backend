const { Sequelize, DataTypes, QueryTypes, where, Op } = require("sequelize");
const {responseError, responseSuccess} = require('../helper/responce')


exports.storeLeadStatus = async(req, res) =>{
    try {
        let {status_name} = req.body
        let statusData;

        statusData = await req.config.leadStatuses.findOne({where:{status_name : status_name
        }})

        if(statusData)   return await responseError(req, res, "status name already exist")
     
            let count  = await req.config.leadStatuses.count({ paranoid: false })
            let body = {
                status_name: status_name,
                lead_status_code: `ST_${count+1}`,
                status: true
            }
            statusData =  await req.config.leadStatuses.create(body)
            return await responseSuccess(req, res, "type created Succesfully", statusData )
       
    } catch (error) {
    logErrorToFile(error)
        return await responseError(req, res, "Something Went Wrong")
    }
}

exports.getLeadStatus = async(req, res) =>{
    try {
        let statusData = await req.config.leadStatuses.findAll()
        return await responseSuccess(req, res, "Status list", statusData)
       
    } catch (error) {
    logErrorToFile(error)
        return await responseError(req, res, "Something Went Wrong")
    }
}


exports.editLeadStatus = async(req, res) =>{
    try {

        let {status_name , lead_status_id, lead_status_code} = req.body
        let body = req.body
        if(status_name){
            let statusData = await req.config.leadStatuses.findOne({
                where:{
                    lead_status_code: {[Op.ne]: lead_status_code},
                    status_name: status_name
                }
            })
    
            if(statusData) return await responseError(req, res, "status name already existed") 
        }
        
            await req.config.leadStatuses.update(body, {
                where:{
                    lead_status_id: lead_status_id
                }
            })
            return await responseSuccess(req, res, "type updated")

    } catch (error) {
    logErrorToFile(error)
        return await responseError(req, res, "Something Went Wrong")
    }
}


exports.deleteLeadStatus = async(req, res) =>{
    try {

        let {st_id} = req.query
        let statusData = await req.config.leadStatuses.findOne({
            where:{
                lead_status_id: st_id,
            }
        })

        if(!statusData) return await responseError(req, res, "status name does not existed") 
        await statusData.destroy()
        return await responseSuccess(req, res, "status deleted")

    } catch (error) {
    logErrorToFile(error)
        console.log(error)
        return await responseError(req, res, "Something Went Wrong")
    }
}