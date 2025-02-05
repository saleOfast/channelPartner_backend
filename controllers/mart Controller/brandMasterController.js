const { Sequelize, DataTypes, QueryTypes, where, Op } = require("sequelize");
const {responseError, responseSuccess} = require('../../helper/responce')


exports.storeBrand = async(req, res) =>{
    const processs = await req.config.sequelize.transaction();
    try {
        let {name, user_id } = req.body
        let leadRateData;

        let brandData = await req.config.martBrandModel.findOne(
            {where:
                {name}
            },{ transaction: processs })


        if(brandData){
            processs.cleanup();
            return await responseError(req, res, "mart brand name already exist")
        }  
     
            leadRateData =  await req.config.martBrandModel.create({
                name, user_id
            }, 
            { transaction: processs })
            await processs.commit();
            return await responseSuccess(req, res, "mart brand created Succesfully", leadRateData )
       
    } catch (error) {
        await processs.rollback();
        return await responseError(req, res, "Something Went Wrong")
    }
}

exports.getBrandList = async(req, res) =>{
    const t = await req.config.sequelize.transaction();
    try {


        let brandListData = await req.config.martBrandModel.findAll({
            include: {
                model: req.config.users,
                as: "BrandUserData",
                attributes: ["user_id", "user"],
                paranoid: false,
            },
        } , {transaction: t})
        t.commit()
        return await responseSuccess(req, res, "brand list", brandListData)
       
    } catch (error) {
        t.rollback()
        return await responseError(req, res, "Something Went Wrong")
    }
}

