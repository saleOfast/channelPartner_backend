const { Sequelize, DataTypes, QueryTypes, where, Op } = require("sequelize");
const {responseError, responseSuccess} = require('../helper/responce')


// Crud for Leave Head Start --------------------------------------------------------------
exports.storeleaveHead = async(req, res) =>{
    try {
        let body = req.body;

        let leaveHeadBody = await req.config.leaveHeads.findOne({where:{head_leave_name : body.head_leave_name
        }})

        if(leaveHeadBody) return await responseError(req, res, "head name already exist")
     
            let count  = await req.config.leaveHeads.count({ paranoid: false })
            body.head_leave_code = `LH_${count+1}`
            let leaveHeadData =  await req.config.leaveHeads.create(body)
            return await responseSuccess(req, res, "head leave created Succesfully", leaveHeadData)
       
    } catch (error) {
    logErrorToFile(error)
        return await responseError(req, res, "Something Went Wrong")
    }
}

exports.getleaveHead = async(req, res) =>{
    try {
        let leaveHeadBody = await req.config.leaveHeads.findAll()
        return await responseSuccess(req, res, "lead leave list", leaveHeadBody)
       
    } catch (error) {
    logErrorToFile(error)
        console.log(error);
        return await responseError(req, res, "Something Went Wrong")
    }
}


exports.editleaveHead = async(req, res) =>{
    try {

        let {head_leave_id , head_leave_name, head_leave_code} = req.body
        let body = req.body
        if(head_leave_name){
            let leaveHeadBody = await req.config.leaveHeads.findOne({
                where:{
                    head_leave_code: {[Op.ne]: head_leave_code},
                    head_leave_name: head_leave_name
                }
            })
    
            if(leaveHeadBody) return await responseError(req, res, "head leave already existed") 
        }
            await req.config.leaveHeads.update(body, {
                where:{
                    head_leave_id: head_leave_id
                }
            })
            return await responseSuccess(req, res, "head type updated")

    } catch (error) {
    logErrorToFile(error)
        console.log(error)
        return await responseError(req, res, "Something Went Wrong")
    }
}


exports.deleteleaveHead = async(req, res) =>{
    try {

        let {h_id} = req.query
        let leaveHeadBody = await req.config.leaveHeads.findOne({
            where:{
                head_leave_id: h_id,
            }
        })

        if(!leaveHeadBody) return await responseError(req, res, "leave head name does not existed") 
        await leaveHeadBody.destroy()
        return await responseSuccess(req, res, "leave head deleted")

    } catch (error) {
    logErrorToFile(error)
        console.log(error)
        return await responseError(req, res, "Something Went Wrong")
    }
}

// Crud for Leave Head End --------------------------------------------------------------

// Crud for Leave Head Count in One Financial Year --------------------------------------------------------------

exports.storeleaveHeadCount = async(req, res) =>{
    try {
        let body = req.body;

        let leaveHeadBody = await req.config.leaveHeadCounts.findOne(
            {
                where:{
                    head_leave_id : body.head_leave_id,
                    financial_start:  body.financial_start,
                    financial_end:  body.financial_end,
                }
            }
        )

        if(leaveHeadBody) return await responseError(req, res, "head name already exist for this year")
     
        let leaveHeadData =  await req.config.leaveHeadCounts.create(body)
        return await responseSuccess(req, res, "head leave count created Succesfully", leaveHeadData)
       
    } catch (error) {
    logErrorToFile(error)
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

exports.getleaveHeadOfCurrentYaer = async(req, res) => {
    try {

        let currentYear = new Date().getFullYear();

        // if month is between jan to march the yaer will be taken as last financial yaervto current financial yaer
        let currentMonth = new Date().getMonth();
        if (currentMonth <= 2){
            currentYear = parseInt(currentYear) - 1
        }

        // if want to search for some specific yaer
        if(req.query.year){
            currentYear = parseInt(req.query.year)
        }
        // Get 1st April of current year
        const firstApril = new Date(currentYear, 3, 1); // month is zero-based, so 3 is April
        // Get 31st March of next year
        const nextYear = currentYear + 1;
        const lastMarch = new Date(nextYear, 2, 31); // month is zero-based, so 2 is March
        let fromDate = formatDate(firstApril)
        let toDate = formatDate(lastMarch)


        let leaveHeadBody = []
        if(req.query.mode == 'user'){
           leaveHeadBody = await req.config.leaveHeadCounts.findAll({
            where:{
                financial_start: fromDate, 
                financial_end: toDate
            },
            include: [
                {model: req.config.leaveHeads, as:"leaveHead", paranoid: false,},
            ],
        })
        }else{
            leaveHeadBody = await req.config.leaveHeads.findAll({
                include: [
                    {model: req.config.leaveHeadCounts, as:"leaveHead", required: false, where:{
                        financial_start: fromDate, 
                        financial_end: toDate
                    }},
                ],
            })
        }
        
        return await responseSuccess(req, res, "lead leave list", leaveHeadBody)
       
    } catch (error) {
    logErrorToFile(error)
        console.log(error);
        return await responseError(req, res, "Something Went Wrong")
    }
}

exports.editleaveHeadCount = async(req, res) =>{
    try {
        let body = req.body;

        let leaveHeadBody = await req.config.leaveHeadCounts.findOne(
            {
                where :{
                    head_leave_cnt_id: {[Op.ne]: body.head_leave_cnt_id,},
                    head_leave_id : body.head_leave_id,
                    financial_start:  body.financial_start,
                    financial_end:  body.financial_end,
                }
            }
        )

        if(leaveHeadBody) return await responseError(req, res, "leave head name already exist for this year")
     
        let leaveHeadData =  await req.config.leaveHeadCounts.update(body ,{where :{
            head_leave_cnt_id:  body.head_leave_cnt_id,
        }} )
        return await responseSuccess(req, res, "head leave count updated Succesfully", leaveHeadData)
       
    } catch (error) {
    logErrorToFile(error)
        console.log(error)
        return await responseError(req, res, "Something Went Wrong")
    }
}

exports.deleteleaveHeadCount = async(req, res) =>{
    try {

        let {hc_id} = req.query
        let leaveHeadBody = await req.config.leaveHeadCounts.findOne({
            where:{
                head_leave_cnt_id: hc_id,
            }
        })

        if(!leaveHeadBody) return await responseError(req, res, "leave head name does not existed") 
        await leaveHeadBody.destroy()
        return await responseSuccess(req, res, "leave head count deleted")

    } catch (error) {
    logErrorToFile(error)
        console.log(error)
        return await responseError(req, res, "Something Went Wrong")
    }
}