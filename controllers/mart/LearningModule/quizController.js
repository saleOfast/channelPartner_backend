const { Sequelize, DataTypes, QueryTypes, where, Op } = require("sequelize");
const {responseError, responseSuccess} = require('./../../../helper/responce')


exports.storeQuiz = async(req, res) =>{
    try {
        let {questions} = req.body
        let quizData;

        quizData = await req.config.quizModel.findOne(
            {where:
                {questions}
            })

        if(quizData)  return await responseError(req, res, "this particular question already exist")
     
        quizData =  await req.config.quizModel.create(req.body)
            return await responseSuccess(req, res, "quiz question created Succesfully", quizData )
       
    } catch (error) {
    logErrorToFile(error)
        console.log(error)
        return await responseError(req, res, "Something Went Wrong")
    }
}

exports.getAllQuiz = async(req, res) =>{
    try {
        let quizList = await req.config.quizModel.findAll({})
        return await responseSuccess(req, res, "quiz list", quizList)
       
    } catch (error) {
    logErrorToFile(error)
        return await responseError(req, res, "Something Went Wrong")
    }
}

exports.getSingleQuiz = async(req, res) =>{
    try {
        let quiz_id= req.params.id;
        let quizList = await req.config.quizModel.findByPk(quiz_id)
        return await responseSuccess(req, res, "quiz list", quizList)
       
    } catch (error) {
    logErrorToFile(error)
        return await responseError(req, res, "Something Went Wrong")
    }
}

