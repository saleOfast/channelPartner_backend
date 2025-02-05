const { Sequelize, DataTypes, QueryTypes, where, Op } = require("sequelize");
const {responseError, responseSuccess} = require('../helper/responce')


// Crud for Leave Head Start --------------------------------------------------------------
exports.storePolicyHead = async(req, res) =>{
    try {
        let body = req.body;

        let policyHeadBody = await req.config.policyHead.findOne({where:{policy_name : body.policy_name
        }})

        if(policyHeadBody) return await responseError(req, res, "head name already exist")
     
            let count  = await req.config.policyHead.count({ paranoid: false })
            body.policy_code = `PH_${count+1}`
            let policyHeadData =  await req.config.policyHead.create(body)
            return await responseSuccess(req, res, "head policy created Succesfully", policyHeadData)
       
    } catch (error) {
    logErrorToFile(error)
        console.log(error);
        return await responseError(req, res, "Something Went Wrong")
    }
}

exports.getPolicyHead = async(req, res) =>{
    try {
        let policyHeadBody = await req.config.policyHead.findAll()
        return await responseSuccess(req, res, "policy list", policyHeadBody)
       
    } catch (error) {
    logErrorToFile(error)
        console.log(error);
        return await responseError(req, res, "Something Went Wrong")
    }
}


exports.editpolicyHead = async(req, res) =>{
    try {

        let body = req.body
        if(body.policy_name){
            let policyHeadBody = await req.config.policyHead.findOne({
                where:{
                    policy_code: {[Op.ne]: body.policy_code},
                    policy_name: body.policy_name
                }
            })
    
            if(policyHeadBody) return await responseError(req, res, "policy head already existed") 
        }
            await req.config.policyHead.update(body, {
                where:{
                    policy_id: body.policy_id
                }
            })
            return await responseSuccess(req, res, "head type updated")

    } catch (error) {
    logErrorToFile(error)
        console.log(error)
        return await responseError(req, res, "Something Went Wrong")
    }
}


exports.deletepolicyHead = async(req, res) =>{
    try {

        let {ph_id} = req.query
        let policyHeadBody = await req.config.policyHead.findOne({
            where:{
                policy_id: ph_id,
            }
        })

        if(!policyHeadBody) return await responseError(req, res, "policy head name does not existed") 
        await policyHeadBody.destroy()
        return await responseSuccess(req, res, "policy head deleted")

    } catch (error) {
    logErrorToFile(error)
        console.log(error)
        return await responseError(req, res, "Something Went Wrong")
    }
}

// Crud for Policy Head End --------------------------------------------------------------

// Crud for Policy Type Head Effectice Date --------------------------------------------------------------

exports.storePolicyType = async(req, res) =>{
    try {
        let body = req.body;

        let policyHeadBody = await req.config.policyTypeHead.findOne(
            {
                where:{
                    policy_id : body.policy_id,
                    from_date:  body.from_date,
                    policy_type_name: body.policy_type_name,
                    claim_type:  body.claim_type,
                }
            }
        )

        if(policyHeadBody) return await responseError(req, res, "policy head type already exist")
     
            let policyHeadData =  await req.config.policyTypeHead.create(body)
            return await responseSuccess(req, res, "policy type created Succesfully", policyHeadData)
       
    } catch (error) {
    logErrorToFile(error)
        console.log(error);
        return await responseError(req, res, "Something Went Wrong")
    }
}


// get all policy type -> policy ID wise 

exports.getAllPolicyTypeIDWise = async(req, res) =>{
    try {
        let policyHeadData = await req.config.policyTypeHead.findAll({
            where: {
                policy_id: req.query.ph_id
            },
            include: [
                {model: req.config.policyHead , attributes: {
                        exclude: ['createdAt', 'updatedAt', 'deletedAt']
                    }
                }
            ],
            Order: [
                ['from_date', 'DESC']
            ]
        })
        return await responseSuccess(req, res, "policy type list", policyHeadData)
    } catch (error){
        console.log(error);
        return await responseError(req, res, "Something Went Wrong")
    } 
}
// format year as dddd-mm-yy

const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0"); // month is zero-based
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };



// get policy type for user in expence

exports.getPolicyTypeForUser = async(req, res) => {
    try {
        let policyHeadData = await req.config.policyTypeHead.findAll({
            where: {
                policy_id: req.query.ph_id
            },
            attributes: [
                [req.config.sequelize.fn('DISTINCT', req.config.sequelize.col('policy_type_name')), 'policy_type_name'],
                'policy_id',
                'from_date',
                'to_date',
                'claim_type',
                'cost_per_km'

                // Add other attributes you need
              ],
            Order: [
                ['from_date', 'DESC']
            ]
        })
        return await responseSuccess(req, res, "policy type", policyHeadData)
    } catch (error){
        console.log(error);
        return await responseError(req, res, "Something Went Wrong")
    } 
}


// get one policy for use among them

exports.getPolicyForUser = async(req, res) => {
    try {
        let whereClause = {
            policy_type_id: req.query.id,
            from_date: {
                [Op.lte]:  req.query.from_date// Less than current date + 1 day at midnight
            }
        }

        if(req.query.policy_type_name && req.query.policy_type_name != 'null' && req.query.policy_type_name != 'undefined'){
            whereClause.policy_type_name = req.query.policy_type_name
        }


        let policyHeadBody = []
   
           policyHeadBody = await req.config.policyTypeHead.findAll({
            where: whereClause,
            include: [
                {model: req.config.policyHead, paranoid: false,},
            ],
            order: [['from_date', 'DESC']],
            limit: 1
        })
        return await responseSuccess(req, res, "lead policy list", policyHeadBody)
        
    } catch (error) {
    logErrorToFile(error)
        console.log(error);
        return await responseError(req, res, "Something Went Wrong")
    }
}



exports.editPolicyType = async(req, res) =>{
    try {
        let body = req.body;
  
        let policyHeadData =  await req.config.policyTypeHead.update(body ,{where :{
            policy_type_id:  body.policy_type_id,
        }} )
        return await responseSuccess(req, res, "policy Type updated Succesfully", policyHeadData)
       
    } catch (error) {
    logErrorToFile(error)
        console.log(error)
        return await responseError(req, res, "Something Went Wrong")
    }
}

exports.deletePolicyType = async(req, res) =>{
    try {

        let {pt_id} = req.query
        let policyHeadBody = await req.config.policyTypeHead.findOne({
            where:{
                policy_type_id: pt_id,
            }
        })

        if(!policyHeadBody) return await responseError(req, res, "policy type does not existed") 
        await policyHeadBody.destroy()
        return await responseSuccess(req, res, "policy type deleted")

    } catch (error) {
    logErrorToFile(error)
        console.log(error)
        return await responseError(req, res, "Something Went Wrong")
    }
}