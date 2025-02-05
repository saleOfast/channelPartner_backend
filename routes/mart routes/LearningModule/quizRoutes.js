//importing modules
const express = require("express");
const quizController = require("../../../controllers/mart Controller/LearningModule/quizController");
const {resolver} = require("../../../connectionResolver/resolver");
const {protect , rolePermission} = require("../../../middleware/authController")
const {userValidationRules, validate ,superValidate } = require('../../../validator/validation');
const router = express.Router();



//admin routes
router
    .route("/")
        .post(resolver, protect,  userValidationRules('mart_quiz'), validate, quizController.storeQuiz)
        .get(resolver, protect, quizController.getAllQuiz)

    router.route("/:id").get(resolver, protect, quizController.getSingleQuiz)



module.exports = router;