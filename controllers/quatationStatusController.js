const { Sequelize, DataTypes, QueryTypes, where, Op } = require("sequelize");
const {responseError, responseSuccess} = require('../helper/responce')


exports.storeQuatStatus = async(req, res) =>{
    try {
        let {quat_status_name} = req.body
        let statusData;

        statusData = await req.config.quatStatuses.findOne({where:{quat_status_name : quat_status_name
        }})

        if(statusData)   return await responseError(req, res, "status name already exist")
     
            let count  = await req.config.quatStatuses.count({ paranoid: false })
            let body = {
                quat_status_name: quat_status_name,
                quat_status_code: `QST_${count+1}`,
                status: true
            }
            statusData =  await req.config.quatStatuses.create(body)
            return await responseSuccess(req, res, "type created Succesfully", statusData )
       
    } catch (error) {
    logErrorToFile(error)
        return await responseError(req, res, "Something Went Wrong")
    }
}

exports.getQuatStatus = async(req, res) =>{
    try {
        let statusData = await req.config.quatStatuses.findAll()
        return await responseSuccess(req, res, "Status list", statusData)
       
    } catch (error) {
    logErrorToFile(error)
        return await responseError(req, res, "Something Went Wrong")
    }
}


exports.editQuatStatus = async(req, res) =>{
    try {

        let {quat_status_name , quat_status_id, quat_status_code} = req.body
        let body = req.body
        if(quat_status_name){
            let statusData = await req.config.quatStatuses.findOne({
                where:{
                    quat_status_code: {[Op.ne]: quat_status_code},
                    quat_status_name: quat_status_name
                }
            })
    
            if(statusData) return await responseError(req, res, "status name already existed") 
        }
        
            await req.config.quatStatuses.update(body, {
                where:{
                    quat_status_id: quat_status_id
                }
            })
            return await responseSuccess(req, res, "type updated")

    } catch (error) {
    logErrorToFile(error)
        return await responseError(req, res, "Something Went Wrong")
    }
}


exports.deleteQuatStatus = async(req, res) =>{
    try {

        let {qst_id} = req.query
        let statusData = await req.config.quatStatuses.findOne({
            where:{
                quat_status_id: qst_id,
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