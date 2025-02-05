const { Sequelize, DataTypes, QueryTypes, where, Op } = require("sequelize");
const {responseError, responseSuccess} = require('../helper/responce')

exports.storeProductTax = async(req, res) =>{
    try {
        let productTaxData = req.body
        let pTaxData ;
       
        await Promise.all(productTaxData?.map(async(item, i)=>{
            pTaxData = await req.config.productTaxes.findOne({
                where:{
                    p_id: item.p_id,
                    tax_id: item.tax_id
                },
                paranoid: false,
            })

            if(pTaxData){
                if(pTaxData.deleteAt == null){
                    await pTaxData.restore();
                }
                return item
            }else{
                await req.config.productTaxes.create(item)
                return item
            }
        }))
        return responseSuccess(req, res, "product mapped successfuly with taxes")
        
    } catch (error) {
    logErrorToFile(error)
        console.log(error)
        return responseError(req, res, "Something Went Wrong")
    }
}

exports.getProductTax = async(req, res) =>{
    try {
         let productTaxes;
    
        if(req.query.p_t_id){
            productTaxes = await req.config.productTaxes.findOne({
                where:{
                    product_tax_id: req.query.p_t_id
                },
                include: [
                    {model: req.config.tax ,paranoid: false,}, 
                    {model: req.config.products, paranoid: false,}, 
            ],order: [
                ['product_tax_id', 'DESC']
              ]
            })
        }
        else if(req.query.p_id){
            productTaxes = await req.config.productTaxes.findAll({
                where:{
                    p_id: req.query.p_id
                },
                include: [
                    {model: req.config.tax ,paranoid: false,}, 
                    {model: req.config.products, paranoid: false,}, 
            ],order: [
                ['product_tax_id', 'DESC']
              ]
            })
        }
        else{
            productTaxes = await req.config.productTaxes.findAll({
                include: [
                    {model: req.config.tax, paranoid: false,}, 
                    {model: req.config.products, paranoid: false,}, 
            ],order: [
                ['product_tax_id', 'DESC']
              ]
            })
        }   
        await responseSuccess(req, res, "productTaxes list", productTaxes)
       
    } catch (error) {
    logErrorToFile(error)
        console.log(error)
        return await responseError(req, res, "Something Went Wrong")
    }
}

exports.getQuatationProductTax = async(req, res) =>{
    try {
        let productTaxes;

        let findAdmin = await req.config.users.findOne({where :{
            isDB : true
        }})
    
       if(req.query.p_id){
           
            if(req.query.st_id == findAdmin.state_id){
                productTaxes = await req.config.productTaxes.findAll({
                    where: {
                        p_id: req.query.p_id
                    },
                    include: [
                        {model: req.config.tax ,paranoid: false, where: {
                            state_type : "intrastate"
                        }}, 
                        {model: req.config.products, paranoid: false,}, 
                ],order: [
                    ['product_tax_id', 'DESC']
                ]
                })
            }
            else{
                    productTaxes = await req.config.productTaxes.findAll({
                        where: {
                            p_id: req.query.p_id
                        },
                        include: [
                            {model: req.config.tax, paranoid: false, where: {
                                state_type : "InterState"
                            }}, 
                            {model: req.config.products, paranoid: false,}, 
                    ],order: [
                        ['product_tax_id', 'DESC']
                      ]
                    })
                }   
        }
      
        await responseSuccess(req, res, "productTaxes list", productTaxes)
       
    } catch (error) {
    logErrorToFile(error)
        console.log(error)
        return await responseError(req, res, "Something Went Wrong")
    }
}

exports.editProductTax = async(req, res) =>{
    try{
        
        let productTaxData = req.body
        const searchCriteria = {
            p_id: productTaxData.p_id,
            tax_id: productTaxData.tax_id,
            product_tax_id : {[Op.ne]: productTaxData.product_tax_id}
          };
          
        pTaxData = await  req.config.productTaxes.findAll({ where: searchCriteria });
        if(pTaxData?.length>0) return responseError(req, res, "this product with this tax already exist")
        await req.config.productTaxes.update(productTaxData, {
            where:{
                product_tax_id: productTaxData.product_tax_id
            }
        })

        return responseSuccess(req, res, "productwith this tax updated successfuly")
        
    } catch (error) {
    logErrorToFile(error)
        console.log(error)
        return responseError(req, res, "Something Went Wrong")
    }
}

exports.deleteProductTax = async(req, res) =>{
    try{
        let {p_t_id} = req.query
        let pTaxData ;
       
        pTaxData = await req.config.productTaxes.findOne({
            where:{
                product_tax_id : p_t_id
            }
        })
        if(!pTaxData) return responseError(req, res, "No product tax found")

        await pTaxData.destroy()
        
        return responseSuccess(req, res, "product tax deleted successfuly")
        
    } catch (error) {
    logErrorToFile(error)
        console.log(error)
        return responseError(req, res, "Something Went Wrong")
    }
}



