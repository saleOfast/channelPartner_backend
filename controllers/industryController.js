const { Sequelize, DataTypes, QueryTypes, where, Op } = require("sequelize");
const {responseError, responseSuccess} = require('../helper/responce')


exports.storeIndustry = async(req, res) =>{
    try {
        let {industry_name} = req.body
        let industryData;

        industryData = await req.config.industry.findOne({where:{industry : industry_name
        }})

        if(industryData)   return await responseError(req, res, "industry_name already exist")
     
            let count  = await req.config.industry.count({ paranoid: false })
            let body = {
                industry: industry_name,
                ind_code: `IND_${count+1}`,
                status: true
            }
            industryData =  await req.config.industry.create(body)
            return await responseSuccess(req, res, "industry created Succesfully", industryData )
       
    } catch (error) {
    logErrorToFile(error)
        return await responseError(req, res, "Something Went Wrong")
    }
}

exports.getIndustry = async(req, res) =>{
    try {
        let industryData = await req.config.industry.findAll()
        return await responseSuccess(req, res, "industry list", industryData)
       
    } catch (error) {
    logErrorToFile(error)
        return await responseError(req, res, "Something Went Wrong")
    }
}


exports.editIndustry = async(req, res) =>{
    try {

        let {industry_name , ind_id, ind_code} = req.body
        let body = req.body
        if(industry_name){
            body.industry = industry_name
            let industryData = await req.config.industry.findOne({
                where:{
                    ind_code: {[Op.ne]: ind_code},
                    industry: industry_name
                }
            })
            if(industryData) return await responseError(req, res, "industry name already existed") 
        }
            await req.config.industry.update(body, {
                where:{
                    ind_id: ind_id
                }
            })
            return await responseSuccess(req, res, "industry updated")

    } catch (error) {
    logErrorToFile(error)
        return await responseError(req, res, "Something Went Wrong")
    }
}


exports.deleteIndustry = async(req, res) =>{
    try {

        let {ind_id} = req.query
        let industryData = await req.config.industry.findOne({
            where:{
                ind_id: ind_id,
            }
        })

        if(!industryData) return await responseError(req, res, "industry name does not existed") 
        await industryData.destroy()
        return await responseSuccess(req, res, "industry deleted")

    } catch (error) {
    logErrorToFile(error)
        console.log(error)
        return await responseError(req, res, "Something Went Wrong")
    }
}