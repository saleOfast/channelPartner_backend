const { Sequelize, DataTypes, QueryTypes, where, Op } = require("sequelize");
const {responseError, responseSuccess} = require('../helper/responce')


exports.storeLoss = async(req, res) =>{
    try {
        let {loss_reason} = req.body
        let lossData;

        lossData = await req.config.losses.findOne({where:{loss_reason:loss_reason
        }})

        if(lossData) return await responseError(req, res, " loss reason name already exist")
     
            let count  = await req.config.losses.count({ paranoid: false })
            let body = {
                loss_reason: loss_reason,
                loss_code: `ls_${count+1}`,
                status: true
            }
            lossData =  await req.config.losses.create(body)
            return await responseSuccess(req, res, " loss reason created Succesfully", lossData )
       
    } catch (error) {
    logErrorToFile(error)
        return await responseError(req, res, "Something Went Wrong")
    }
}

exports.getLoss = async(req, res) =>{
    try {
        let lossData = await req.config.losses.findAll()
        return await responseSuccess(req, res, " loss reason list", lossData)
       
    } catch (error) {
    logErrorToFile(error)
        return await responseError(req, res, "Something Went Wrong")
    }
}


exports.editLoss = async(req, res) =>{
    try {

        let {loss_reason , loss_id, loss_code} = req.body
        let body = req.body
        if(loss_reason){
        let lossData = await req.config.losses.findOne({
            where:{
                loss_code: {[Op.ne]: loss_code},
                loss_reason: loss_reason
            }
        })
        if(lossData) return await responseError(req, res, " loss reason name already existed") 
        }
            await req.config.losses.update(body, {
                where:{
                    loss_id: loss_id
                }
            })
            return await responseSuccess(req, res, " loss reason updated")

    } catch (error) {
    logErrorToFile(error)
        return await responseError(req, res, "Something Went Wrong")
    }
}


exports.deleteLoss = async(req, res) =>{
    try {

        let {ls_id} = req.query
        let lossData = await req.config.losses.findOne({
            where:{
                loss_id: ls_id,
            }
        })

        if(!lossData) return await responseError(req, res, " loss reason name does not existed") 
        await lossData.destroy()
        return await responseSuccess(req, res, " loss reason deleted")

    } catch (error) {
    logErrorToFile(error)
        console.log(error)
        return await responseError(req, res, "Something Went Wrong")
    }
}