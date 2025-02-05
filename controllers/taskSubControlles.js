const { Sequelize, DataTypes, QueryTypes, where, Op } = require("sequelize");
const {responseError, responseSuccess} = require('../helper/responce')


exports.storeTaskStatus = async(req, res) =>{
    try {
        let {task_status_name} = req.body
        let taskStatusData;

        taskStatusData = await req.config.taskStatus.findOne({where:{task_status_name : task_status_name
        }})

        if(taskStatusData)   return await responseError(req, res, "task status name already exist")

            let count  = await req.config.taskStatus.count({ paranoid: false })
            let body = {
                task_status_name: task_status_name,
                task_status_code: `ST_${count+1}`,
                status: true
            }
            taskStatusData =  await req.config.taskStatus.create(body)
            return await responseSuccess(req, res, "task status created Succesfully", taskStatusData )
    } catch (error) {
    logErrorToFile(error)
        return await responseError(req, res, "Something Went Wrong")
    }
}

exports.storeBulkTaskStatus = async(req, res) => {
    try {
        let bulkData = req.body
        await Promise.allSettled(bulkData.map(async(item, i)=>{

           let taskStatusData = await req.config.taskStatus.findOne({where:{task_status_name:item["Task Status"]
            }})

            if(taskStatusData){

            }else{
                let count  = await req.config.taskStatus.count({ paranoid: false })
                let body = {
                    task_status_name: item["Task Status"],
                    task_status_code: `ST_${count+1}`,
                    status: true
                }
                taskStatusData =  await req.config.taskStatus.create(body)
            }
            return item
        }))

        return await responseSuccess(req, res, "task status bulk created succesfully", bulkData )

    } catch (error) {
    logErrorToFile(error)
        return await responseError(req, res, "Something Went Wrong")
    }
}

exports.getTaskStatus = async(req, res) =>{
    try {
        let taskStatusData = await req.config.taskStatus.findAll()
        return await responseSuccess(req, res, "task status list", taskStatusData)

    } catch (error) {
    logErrorToFile(error)
        console.log(error)
        return await responseError(req, res, "Something Went Wrong")
    }
}


exports.editTaskStatus = async(req, res) =>{
    try {

        let {task_status_name , task_status_id, task_status_code} = req.body
        let body = req.body
        if(task_status_name){
            let taskStatusData = await req.config.taskStatus.findOne({
                where:{
                    task_status_code: {[Op.ne]: task_status_code},
                    task_status_name: task_status_name
                }
            })

            if(taskStatusData) return await responseError(req, res, "task status name already existed")
        }

            await req.config.taskStatus.update(body, {
                where:{
                    task_status_id: task_status_id
                }
            })
            return await responseSuccess(req, res, "task status updated")

    } catch (error) {
    logErrorToFile(error)
        return await responseError(req, res, "Something Went Wrong")
    }
}


exports.deleteTaskStatus = async(req, res) =>{
    try {

        let {st_id} = req.query
        let taskStatusData = await req.config.taskStatus.findOne({
            where:{
                task_status_id: st_id,
            }
        })

        if(!taskStatusData) return await responseError(req, res, "task status name does not existed")
        await taskStatusData.destroy()
        return await responseSuccess(req, res, "task status deleted")

    } catch (error) {
    logErrorToFile(error)
        console.log(error)
        return await responseError(req, res, "Something Went Wrong")
    }
}



/*  --------------------------------- task priority ---------------------------------------- */

exports.storeTaskProirity = async(req, res) => {
    try {
        let {task_priority_name} = req.body
        let taskPriorityData;

        taskPriorityData = await req.config.taskPriority.findOne({where:{task_priority_name : task_priority_name
        }})

        if(taskPriorityData)   return await responseError(req, res, "task priority name already exist")

            let count  = await req.config.taskPriority.count({ paranoid: false })
            let body = {
                task_priority_name: task_priority_name,
                task_priority_code: `TP_${count+1}`,
                status: true
            }
            taskPriorityData =  await req.config.taskPriority.create(body)
            return await responseSuccess(req, res, "task priority created Succesfully", taskPriorityData )

    } catch (error) {
    logErrorToFile(error)
        return await responseError(req, res, "Something Went Wrong")
    }
}

exports.storeBulkTaskPriority = async(req, res) => {
    try {
        let bulkData = req.body
        await Promise.allSettled(bulkData.map(async(item, i)=>{

           let taskPriorityData = await req.config.taskPriority.findOne({where:{task_priority_name:item["Task Priority Name"]
            }})

            if(taskPriorityData){

            }else{
                let count  = await req.config.taskPriority.count({ paranoid: false })
                let body = {
                    task_priority_name: item["Task Priority Name"],
                    task_priority_code: `TP_${count+1}`,
                    status: true
                }
                taskPriorityData =  await req.config.taskPriority.create(body)
            }
            return item
        }))

        return await responseSuccess(req, res, "task priority bulk created succesfully", bulkData )

    } catch (error) {
    logErrorToFile(error)
        return await responseError(req, res, "Something Went Wrong")
    }
}

exports.getTaskProirity = async(req, res) =>{
    try {
        let taskPriorityData = await req.config.taskPriority.findAll()
        return await responseSuccess(req, res, "task priority list", taskPriorityData)

    } catch (error) {
    logErrorToFile(error)
        return await responseError(req, res, "Something Went Wrong")
    }
}


exports.editTaskProirity = async(req, res) =>{
    try {

        let {task_priority_name , task_priority_id, task_priority_code} = req.body
        let body = req.body
        if(task_priority_name){
            let taskPriorityData = await req.config.taskPriority.findOne({
                where:{
                    task_priority_code: {[Op.ne]: task_priority_code},
                    task_priority_name: task_priority_name
                }
            })

            if(taskPriorityData) return await responseError(req, res, "task priority name already existed")
        }

            await req.config.taskPriority.update(body, {
                where:{
                    task_priority_id: task_priority_id
                }
            })
            return await responseSuccess(req, res, "task priority updated")

    } catch (error) {
    logErrorToFile(error)
        return await responseError(req, res, "Something Went Wrong")
    }
}


exports.deleteTaskProirity = async(req, res) =>{
    try {
        let {tp_id} = req.query
        let taskPriorityData = await req.config.taskPriority.findOne({
            where:{
                task_priority_id: tp_id,
            }
        })

        if(!taskPriorityData) return await responseError(req, res, "task priority name does not existed")
        await taskPriorityData.destroy()
        return await responseSuccess(req, res, "task priority deleted")

    } catch (error) {
    logErrorToFile(error)
        console.log(error)
        return await responseError(req, res, "Something Went Wrong")
    }
}