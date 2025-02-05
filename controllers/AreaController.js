const { Sequelize, DataTypes, QueryTypes, where, Op } = require("sequelize");
const {responseError, responseSuccess} = require('../helper/responce')

/* ------------Country CRUD---------------- */

exports.getCountry = async(req, res)=>{
    try {
        let areaData = await req.config.country.findAll()
        return await responseSuccess(req, res, "Country List", areaData )
    } catch (error) {
    logErrorToFile(error)
        return await responseError(req, res, "Something Went Wrong")
    }  
}

exports.storeCountry = async(req, res)=>{
    try {
        const data = await req.config.country.findOne({where:{
            country_name: req.body.country_name,
        }})
        if(data) return await responseError(req, res, "country name already exist") 
        let areaData = await req.config.country.create(req.body)
        return await responseSuccess(req, res, "Country created successfuly", areaData)
        
    } catch (error) {
    logErrorToFile(error)
        console.log(error)
        return await responseError(req, res, "Something Went Wrong")
    }  
}

exports.editCountry = async(req, res)=>{
    try {
        const data = await req.config.country.findOne({where:{
            country_name: req.body.country_name,
            country_id: {[Op.ne]: req.body.country_id}
        }})
        if(data) return await responseError(req, res, "country name already exist") 
        await req.config.country.update(req.body, {
            where:{
                country_id: req.body.country_id
            }
        })
        return await responseError(req, res, "country name updated successfully") 

    } catch (error) {
    logErrorToFile(error)
        return await responseError(req, res, "Something Went Wrong")
    }  
}

exports.deleteCountry = async(req, res)=>{
    try {
        let areaData = await req.config.country.findOne({
            where:{
                country_id: req.query.cnt_id,
            }
        })
        if(!areaData) return await responseError(req, res, "country name does not existed") 
        await areaData.destroy()
        return await responseSuccess(req, res, "country deleted")

    } catch (error) {
    logErrorToFile(error)
        return await responseError(req, res, "Something Went Wrong")

    }  
}

/* ------------Country CRUD END---------------- */

/* ------------State CRUD---------------- */

exports.getState = async(req, res)=>{
    try {
        let stateData = await req.config.states.findAll({
            where:{
                country_id : req.query.cnt_id
            }
        })
        return await responseSuccess(req, res, "State List", stateData )
    } catch (error) {
    logErrorToFile(error)
        return await responseError(req, res, "Something Went Wrong")
    }  
}

exports.storeStates = async(req, res)=>{
    try {
        const data = await req.config.states.findOne({where:{
            country_id: req.body.country_id,
            state_name: req.body.state_name,
        }})
        if(data) return await responseError(req, res, "State name already exist") 
        let stateData = await req.config.states.create(req.body)
        return await responseSuccess(req, res, "State created successfuly", stateData)
        
    } catch (error) {
    logErrorToFile(error)
        return await responseError(req, res, "Something Went Wrong")
    }  
}

exports.editStates = async(req, res)=>{
    try {
        const data = await req.config.states.findOne({where:{
            country_id: req.body.country_id,
            state_name: req.body.state_name,
            state_id: {[Op.ne]: req.body.state_id}
        }})
        if(data) return await responseError(req, res, "state name already exist") 
        await req.config.states.update(req.body, {
            where:{
                state_id: req.body.state_id
            }
        })
        return await responseError(req, res, "state name updated successfully") 

    } catch (error) {
    logErrorToFile(error)
        return await responseError(req, res, "Something Went Wrong")
    }  
}

exports.deleteStates = async(req, res)=>{
    try {
        let stateData = await req.config.states.findOne({
            where:{
                state_id: req.query.st_id,
            }
        })
        if(!stateData) return await responseError(req, res, "state name does not existed") 
        await stateData.destroy()
        return await responseSuccess(req, res, "state deleted")

    } catch (error) {
    logErrorToFile(error)
        return await responseError(req, res, "Something Went Wrong")

    }  
}

/* ------------State CRUD END---------------- */

/* ------------City CRUD ---------------- */


exports.getCityAndDistrict = async(req, res)=>{
    try {
        let cityData = await req.config.city.findAll({
            where:{
                state_id : req.query.st_id
            }
        })
        let distictData = await req.config.districts.findAll({
            where:{
                state_id : req.query.st_id
            }
        })

        let cityDistict = {
            cityData ,
            distictData
        }
        return await responseSuccess(req, res, "city and district List", cityDistict )
    } catch (error) {
    logErrorToFile(error)
        return await responseError(req, res, "Something Went Wrong")
    }  
}

exports.storeCity = async(req, res)=>{
    try {
        const data = await req.config.city.findOne({where:{
            state_id: req.body.state_id,
            city_name: req.body.city_name,
        }})
        if(data) return await responseError(req, res, "City name already exist") 
        let cityData = await req.config.city.create(req.body)
        return await responseSuccess(req, res, "City created successfuly", cityData)
        
    } catch (error) {
    logErrorToFile(error)
        return await responseError(req, res, "Something Went Wrong")
    }  
}

exports.editCity = async(req, res)=>{
    try {
        const data = await req.config.city.findOne({where:{
            state_id: req.body.state_id,
            city_name: req.body.city_name,
            city_id: {[Op.ne]: req.body.city_id}
        }})
        if(data) return await responseError(req, res, "City name already exist") 
        await req.config.city.update(req.body, {
            where:{
                city_id: req.body.city_id
            }
        })
        return await responseError(req, res, "City name updated successfully") 

    } catch (error) {
    logErrorToFile(error)
        return await responseError(req, res, "Something Went Wrong")
    }  
}

exports.deleteCity = async(req, res)=>{
    try {
        let cityData = await req.config.city.findOne({
            where:{
                city_id: req.query.ct_id,
            }
        })
        if(!cityData) return await responseError(req, res, "City name does not existed") 
        await cityData.destroy()
        return await responseSuccess(req, res, "City deleted")

    } catch (error) {
    logErrorToFile(error)
        return await responseError(req, res, "Something Went Wrong")

    }  
}

/* ------------City CRUD END---------------- */

/* ------------District CRUD ---------------- */

exports.storeDistrict = async(req, res)=>{
    try {
        const data = await req.config.districts.findOne({where:{
            state_id: req.body.state_id,
            district_name: req.body.district_name,
        }})
        if(data) return await responseError(req, res, "District name already exist") 
        let districtData = await req.config.districts.create(req.body)
        return await responseSuccess(req, res, "District created successfuly", districtData)
        
    } catch (error) {
    logErrorToFile(error)
        console.log(error)
        return await responseError(req, res, "Something Went Wrong")
    }  
}

exports.editDistrict = async(req, res)=>{
    try {
        const data = await req.config.districts.findOne({where:{
            state_id: req.body.state_id,
            district_name: req.body.district_name,
            district_id: {[Op.ne]: req.body.district_id}
        }})
        if(data) return await responseError(req, res, "District name already exist") 
        await req.config.districts.update(req.body, {
            where:{
                district_id: req.body.district_id
            }
        })
        return await responseError(req, res, "District name updated successfully") 

    } catch (error) {
    logErrorToFile(error)
        return await responseError(req, res, "Something Went Wrong")
    }  
}

exports.deleteDistrict = async(req, res)=>{
    try {
        let districtData = await req.config.districts.findOne({
            where:{
                district_id: req.query.dis_id,
            }
        })
        if(!districtData) return await responseError(req, res, "District name does not existed") 
        await districtData.destroy()
        return await responseSuccess(req, res, "District deleted")

    } catch (error) {
    logErrorToFile(error)
        return await responseError(req, res, "Something Went Wrong")

    }  
}

/* ------------District CRUD END---------------- */



