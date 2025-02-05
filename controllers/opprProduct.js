const { Sequelize, DataTypes, QueryTypes, where, Op } = require("sequelize");
const {responseError, responseSuccess} = require('../helper/responce')

exports.createProductArr = async(req, res)=>{
    try {

        let data = req.body
        for (let i = 0; i < data.length; i++) {
            const item = data[i];
            const find = await req.config.productOpportunity.findOne({
                where:{
                    opp_id: item.opp_id,
                    p_id: item.p_id
                }
            })
            if(!find){
                const create = await req.config.productOpportunity.create(item)
            }
          }
        
        return await responseSuccess(req, res, "product mapped to oppotrunity" )
    
      } catch (error) {
    logErrorToFile(error)
        console.log(error)
          return await responseError(req, res, "Something Went Wrong")
      }
}


exports.getAllProductByOpportunity = async(req, res)=>{
    try {

        const productList = await req.config.productOpportunity.findAll({
            where:{
                opp_id: req.query.opp_id,
            }
        })
       
        return await responseSuccess(req, res, "product list", productList)
    
      } catch (error) {
    logErrorToFile(error)
        console.log(error)
          return await responseError(req, res, "Something Went Wrong")
      }
}

exports.deleteProductByPkey = async(req, res)=>{
    try {

        const productData = await req.config.productOpportunity.findByPk(req.query.o_p_id)
        if(!productData) return await responseError(req, res, "product in opportunity not found")
        await productData.destroy()
        return await responseSuccess(req, res, "product data deleted")
    
      } catch (error) {
    logErrorToFile(error)
        console.log(error)
          return await responseError(req, res, "Something Went Wrong")
      }
}

exports.editProductByPkey = async(req, res)=>{
    try {
        const productBody = req.body
        let productData = await req.config.productOpportunity.bulkCreate(productBody, {updateOnDuplicate: ["o_p_id","p_id","opp_id","qty", "price"]
        })
        await responseSuccess(req, res, "product data updated",productData)
    }  catch (error) {
    logErrorToFile(error)
        console.log(error)
        return await responseError(req, res, "Something Went Wrong")
    }
}
