//importing modules
const express = require("express");
const martStoreCategoryController = require("../../controllers/mart/martStoreCategoryController");
const {resolver} = require("../../connectionResolver/resolver");
const {protect , rolePermission} = require("../../middleware/authController")
const {userValidationRules, validate ,superValidate } = require('../../validator/validation');
const router = express.Router();



//admin routes
router
    .route("/")
        .post(resolver, protect,  userValidationRules('martStoreCategory'), validate, martStoreCategoryController.storeCategory)
        .get(resolver, protect, martStoreCategoryController.getCategoryList)



module.exports = router;