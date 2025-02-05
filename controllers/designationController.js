const { Sequelize, DataTypes, QueryTypes, where, Op } = require("sequelize");
const {responseError, responseSuccess} = require('../helper/responce')


exports.storeDesignation = async(req, res) =>{
    try {
        let {designation_name} = req.body
        let designationData;

        designationData = await req.config.designations.findOne({where:{designation:designation_name
        }})

        if(designationData) return await responseError(req, res, "designation name already exist")
     
            let count  = await req.config.designations.count({ paranoid: false })
            let body = {
                designation: designation_name,
                designation_code: `DES_${count+1}`,
                status: true
            }
            designationData =  await req.config.designations.create(body)
            return await responseSuccess(req, res, "designation created Succesfully", designationData )
       
    } catch (error) {
    logErrorToFile(error)
        return await responseError(req, res, "Something Went Wrong")
    }
}

exports.storeBulkDesignation = async(req, res) => {
    try {
        let bulkData = req.body
        await Promise.allSettled(bulkData.map(async(item, i)=>{

           let designationData = await req.config.designations.findOne({where:{designation:item["Designation"]
            }})
    
            if(designationData){
                
            }else{
                let count  = await req.config.designations.count({ paranoid: false })
                let body = {
                    designation: item["Designation"],
                    designation_code: `DES_${count+1}`,
                    status: true
                }
                designationData =  await req.config.designations.create(body)
            }
            return item
        }))
        
        return await responseSuccess(req, res, "designation bulk created succesfully", bulkData )
       
    } catch (error) {
    logErrorToFile(error)
        return await responseError(req, res, "Something Went Wrong")
    }
}


exports.getDesignation = async(req, res) =>{
    try {
        let designationData = await req.config.designations.findAll()
        return await responseSuccess(req, res, "designation list", designationData)
       
    } catch (error) {
    logErrorToFile(error)
        return await responseError(req, res, "Something Went Wrong")
    }
}


exports.editDesignation = async(req, res) =>{
    try {

        let {designation_name , des_id, designation_code} = req.body
        let body = req.body
        if(designation_name){
            body.designation = designation_name
        let designationData = await req.config.designations.findOne({
            where:{
                designation_code: {[Op.ne]: designation_code},
                designation: designation_name
            }
        })
        if(designationData) return await responseError(req, res, "designation name already existed") 
        }
            await req.config.designations.update(body, {
                where:{
                    des_id: des_id
                }
            })
            return await responseSuccess(req, res, "designation updated")

    } catch (error) {
    logErrorToFile(error)
        return await responseError(req, res, "Something Went Wrong")
    }
}


exports.deleteDesignation = async(req, res) =>{
    try {

        let {des_id} = req.query
        let designationData = await req.config.designations.findOne({
            where:{
                des_id: des_id,
            }
        })

        if(!designationData) return await responseError(req, res, "designation name does not existed") 
        await designationData.destroy()
        return await responseSuccess(req, res, "designation deleted")

    } catch (error) {
    logErrorToFile(error)
        console.log(error)
        return await responseError(req, res, "Something Went Wrong")
    }
}