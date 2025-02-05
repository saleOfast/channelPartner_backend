//importing modules
const express = require("express");
const emailConfigController = require("../controllers/emailConfigController");
const {resolver} = require("../connectionResolver/resolver");
const { rolePermission} = require("../middleware/authController");
const { userValidationRules, validate } = require("../validator/validation");
const router = express.Router();

//admin routes


router
    .route("/")
        .post(resolver,rolePermission,userValidationRules("emailConfigValidations"),validate,emailConfigController.createEmailConfig)
        .get(resolver,rolePermission,emailConfigController.getSingleEmailConfig)
        .put(resolver,rolePermission,emailConfigController.updateEmailConfig)

module.exports = router;