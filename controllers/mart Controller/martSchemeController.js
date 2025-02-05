const { Sequelize, DataTypes, QueryTypes, where, Op } = require("sequelize");
const {responseError, responseSuccess} = require('../../helper/responce')


exports.storeScheme = async(req, res) =>{
    const processs = await req.config.sequelize.transaction();
    try {
        let {name } = req.body
        

        let scheme = await req.config.martSchemeModel.findOne(
            {where:
                {name}
            },{ transaction: processs })


        if(scheme){
            processs.cleanup();
            return await responseError(req, res, "scheme already exist")
        }  
     
        let schemeData =  await req.config.martSchemeModel.create(req.body, 
            { transaction: processs })
            await processs.commit();
            return await responseSuccess(req, res, "scheme created Succesfully", schemeData )
       
    } catch (error) {
        await processs.rollback();
        return await responseError(req, res, "Something Went Wrong")
    }
}

exports.getSchemeList = async(req, res) =>{
    const t = await req.config.sequelize.transaction();
    try {


        let schemeListData = await req.config.martSchemeModel.findAll({
            include: {
                model: req.config.users,
                as: "SchemeUserData",
                attributes: ["user_id", "user"],
                paranoid: false,
            },
        } , {transaction: t})
        t.commit()
        return await responseSuccess(req, res, "scheme list", schemeListData)
       
    } catch (error) {
        t.rollback()
        return await responseError(req, res, "Something Went Wrong")
    }
}

