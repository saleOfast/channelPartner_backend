const { Sequelize, DataTypes, QueryTypes, where, Op } = require("sequelize");
const {responseError, responseSuccess} = require('../helper/responce')

exports.storeTax = async(req, res) =>{
    const process = await req.config.sequelize.transaction();
    try {
        let taxData = req.body
        let tData ;
        tData = await req.config.tax.findOne({
            where:{
                tax_name: taxData.tax_name,
            }
        },{ transaction: process })
        if(tData) {
            await process.cleanup()
            return responseError(req, res, "tax already exist")
        }
        let count  = await req.config.tax.count({ paranoid: false })
        taxData.updated_by  = req.user.user_id
        taxData.tax_code  = `tax${taxData.tax_type}${count}`
        if(taxData.position == ""){
            delete taxData.position
        }
        tData = await req.config.tax.create(taxData, {transaction: process})
        process.commit();
        return responseSuccess(req, res, "tax created successfuly", tData)
        
    } catch (error) {
    logErrorToFile(error)
        process.rollback();
        console.log(error)
        return responseError(req, res, "Something Went Wrong")
    }
}

exports.getTax = async(req, res) =>{
    try {
        let tax;
        if(req.query.t_id){
            tax = await req.config.tax.findOne({
                where:{
                    tax_id: req.query.t_id
                },
                include: [
                    {model: req.config.users, as: "updatedBy", paranoid: false,  attributes: ["user_id", "user"],} 
            ],order: [
                ['tax_id', 'DESC']
            ]
            })
        }else{
            tax = await req.config.tax.findAll({
                include: [
                    {model: req.config.users, as: "updatedBy", paranoid: false,  attributes: ["user_id", "user"],} 
            ],order: [
                ['tax_id', 'DESC']
              ]
            })
        }   
        await responseSuccess(req, res, "tax list", tax)
       
    } catch (error) {
    logErrorToFile(error)
        console.log(error)
        return await responseError(req, res, "Something Went Wrong")
    }
}

exports.editTax = async(req, res) =>{
    try{
        let tData;
        let taxData = req.body
        const searchCriteria = {
                tax_name: taxData.tax_name,
                tax_id: {
                  [Op.ne]: taxData.tax_id,
                },
          };
          
        tData = await  req.config.tax.findAll({ where: searchCriteria });
        if(tData?.length>0) return responseError(req, res, "tax already exist")
        await req.config.tax.update(taxData, {
            where:{
                tax_id: taxData.tax_id
            }
        })

        return responseSuccess(req, res, "tax updated successfuly")
        
    } catch (error) {
    logErrorToFile(error)
        return responseError(req, res, "Something Went Wrong")
    }
}

exports.deleteTax = async(req, res) =>{
    try{
        let {t_id} = req.query
        let tData ;
       
        tData = await req.config.tax.findOne({
            where:{
                tax_id : t_id
            }
        })
        if(!tData) return responseError(req, res, "tax does not exist")

        await tData.destroy()
        
        return responseSuccess(req, res, "tax deleted successfuly")
        
    } catch (error) {
    logErrorToFile(error)
        console.log(error)
        return responseError(req, res, "Something Went Wrong")
    }
}



