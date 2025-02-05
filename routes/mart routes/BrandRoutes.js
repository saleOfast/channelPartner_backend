//importing modules
const express = require("express");
const brandMasterController = require("../../controllers/mart/brandMasterController");
const {resolver} = require("../../connectionResolver/resolver");
const {protect , rolePermission} = require("../../middleware/authController")
const {userValidationRules, validate ,superValidate } = require('../../validator/validation');
const router = express.Router();



//admin routes
router
    .route("/")
        .post(resolver,   userValidationRules('martBrandMaster'), validate, brandMasterController.storeBrand)
        .get(resolver,  brandMasterController.getBrandList)



module.exports = router;