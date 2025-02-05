const { Sequelize, DataTypes, QueryTypes, where, Op } = require("sequelize");
const {responseError, responseSuccess} = require('../helper/responce')


exports.storeDivision = async(req, res) =>{
    try {
        let {divison_name} = req.body
        let divisionData;

        divisionData = await req.config.divisions.findOne({where:{divison:divison_name
        }})

        if(divisionData) return await responseError(req, res, "division_name already exist")
     
            let count  = await req.config.divisions.count({ paranoid: false })
            let body = {
                divison: divison_name,
                divison_code: `D_${count+1}`,
                status: true
            }
            divisionData =  await req.config.divisions.create(body)
            return await responseSuccess(req, res, "divison created Succesfully", divisionData )
       
    } catch (error) {
    logErrorToFile(error)
        return await responseError(req, res, "Something Went Wrong")
    }
}

exports.storeBulkDivision = async(req, res) => {
    try {
        let bulkData = req.body
        await Promise.allSettled(bulkData.map(async(item, i)=>{

           let divisionData = await req.config.divisions.findOne({where:{divison:item["Divison Name"]
            }})
    
            if(divisionData){
                
            }else{
                let count  = await req.config.divisions.count({ paranoid: false })
                let body = {
                    divison: item["Divison Name"],
                    divison_code: `D_${count+1}`,
                    status: true
                }
                divisionData =  await req.config.divisions.create(body)
            }
            return item
        }))
        
        return await responseSuccess(req, res, "divison bulk created succesfully", bulkData )
       
    } catch (error) {
    logErrorToFile(error)
        return await responseError(req, res, "Something Went Wrong")
    }
}


exports.getDivisons = async(req, res) =>{
    try {
        let divisionData = await req.config.divisions.findAll()
        return await responseSuccess(req, res, "divison list", divisionData)
       
    } catch (error) {
    logErrorToFile(error)
        return await responseError(req, res, "Something Went Wrong")
    }
}


exports.editDivison = async(req, res) =>{
    try {

        let {divison_name ,div_id, divison_code , status} = req.body
        let body = req.body
        if(divison_name){
            body.divison = divison_name
            let divisionData = await req.config.divisions.findOne({
                where:{
                    divison_code: {[Op.ne]: divison_code},
                    divison: divison_name
                }
            })
            if(divisionData) return await responseError(req, res, "divison name already existed") 
        }
            await req.config.divisions.update(body, {
                where:{
                    div_id: div_id
                }
            })
            return await responseSuccess(req, res, "division updated")

    } catch (error) {
    logErrorToFile(error)
        return await responseError(req, res, "Something Went Wrong")
    }
}



exports.deleteDivison = async(req, res) =>{
    try {

        let {div_id} = req.query
        let divisionData = await req.config.divisions.findOne({
            where:{
                div_id: div_id,
            }
        })

        if(!divisionData) return await responseError(req, res, "divison name does not existed") 
        await divisionData.destroy()
        return await responseSuccess(req, res, "division deleted")

    } catch (error) {
    logErrorToFile(error)
        console.log(error)
        return await responseError(req, res, "Something Went Wrong")
    }
}