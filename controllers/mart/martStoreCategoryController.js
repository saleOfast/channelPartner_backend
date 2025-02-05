const { Sequelize, DataTypes, QueryTypes, where, Op } = require("sequelize");
const {responseError, responseSuccess} = require('../../helper/responce')


exports.storeCategory = async(req, res) =>{
    const processs = await req.config.sequelize.transaction();
    try {
        let {category_name, user_id } = req.body
        

        let category = await req.config.martStoreCategoryModel.findOne(
            {where:
                {category_name}
            },{ transaction: processs })


        if(category){
            processs.cleanup();
            return await responseError(req, res, "category already exist")
        }  
     
        let categoryData =  await req.config.martStoreCategoryModel.create({
                category_name, user_id
            }, 
            { transaction: processs })
            await processs.commit();
            return await responseSuccess(req, res, "store category created Succesfully", categoryData )
       
    } catch (error) {
    logErrorToFile(error)
        await processs.rollback();
        return await responseError(req, res, "Something Went Wrong")
    }
}

exports.getCategoryList = async(req, res) =>{
    const t = await req.config.sequelize.transaction();
    try {


        let brandListData = await req.config.martStoreCategoryModel.findAll({
            include: {
                model: req.config.users,
                as: "CategoryUserData",
                attributes: ["user_id", "user"],
                paranoid: false,
            },
        } , {transaction: t})
        t.commit()
        return await responseSuccess(req, res, "category list", brandListData)
       
    } catch (error) {
    logErrorToFile(error)
        t.rollback()
        return await responseError(req, res, "Something Went Wrong")
    }
}

