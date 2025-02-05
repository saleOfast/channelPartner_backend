//importing modules
const express = require("express");
const martSchemeController = require("../../controllers/mart Controller/martSchemeController");
const {resolver} = require("../../connectionResolver/resolver");
const {protect , rolePermission} = require("../../middleware/authController")
const {userValidationRules, validate ,superValidate } = require('../../validator/validation');
const router = express.Router();



//admin routes
router
    .route("/")
        .post(resolver, protect,  userValidationRules('martScheme'), validate, martSchemeController.storeScheme)
        .get(resolver, protect, martSchemeController.getSchemeList)



module.exports = router;