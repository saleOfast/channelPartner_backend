const { Sequelize, DataTypes, QueryTypes, where, Op } = require("sequelize");
const {responseError, responseSuccess} = require('../helper/responce')


exports.storeDepartment = async(req, res) =>{
    try {
        let {department_name} = req.body
        let departmentData;

        departmentData = await req.config.departments.findOne({where:{department:department_name
        }})

        if(departmentData) return await responseError(req, res, "department name already exist")
     
            let count  = await req.config.departments.count({ paranoid: false })
            let body = {
                department: department_name,
                department_code: `DEP_${count+1}`,
                status: true
            }
            departmentData =  await req.config.departments.create(body)
            return await responseSuccess(req, res, "department created Succesfully", departmentData )
       
    } catch (error) {
    logErrorToFile(error)
        return await responseError(req, res, "Something Went Wrong")
    }
}

exports.storeBulkDepartment = async(req, res) => {
    try {
        let bulkData = req.body
        await Promise.allSettled(bulkData.map(async(item, i)=>{

           let departmentData = await req.config.departments.findOne({where:{department:item["Department Name"]
            }})
    
            if(departmentData){
                
            }else{
                let count  = await req.config.departments.count({ paranoid: false })
                let body = {
                    department: item["Department Name"],
                    department_code: `DEP_${count+1}`,
                    status: true
                }
                departmentData =  await req.config.departments.create(body)
            }
            return item
        }))
        
        return await responseSuccess(req, res, "department bulk created succesfully", bulkData)
       
    } catch (error) {
    logErrorToFile(error)
        return await responseError(req, res, "Something Went Wrong")
    }
}

exports.getDepartment = async(req, res) =>{
    try {
        let departmentData = await req.config.departments.findAll()
        return await responseSuccess(req, res, "department list", departmentData)
       
    } catch (error) {
    logErrorToFile(error)
        return await responseError(req, res, "Something Went Wrong")
    }
}


exports.editDepartment = async(req, res) =>{
    try {

        let {department_name , dep_id, department_code} = req.body
        let body = req.body
        if(department_name){
            body.department = department_name
        let departmentData = await req.config.departments.findOne({
            where:{
                department_code: {[Op.ne]: department_code},
                department: department_name
            }
        })
        if(departmentData) return await responseError(req, res, "department name already existed") 
        }
            await req.config.departments.update(body, {
                where:{
                    dep_id: dep_id
                }
            })
            return await responseSuccess(req, res, "department updated")

    } catch (error) {
    logErrorToFile(error)
        return await responseError(req, res, "Something Went Wrong")
    }
}


exports.deleteDepartment = async(req, res) =>{
    try {

        let {dep_id} = req.query
        let departmentData = await req.config.departments.findOne({
            where:{
                dep_id: dep_id,
            }
        })

        if(!departmentData) return await responseError(req, res, "department name does not existed") 
        await departmentData.destroy()
        return await responseSuccess(req, res, "department deleted")

    } catch (error) {
    logErrorToFile(error)
        console.log(error)
        return await responseError(req, res, "Something Went Wrong")
    }
}