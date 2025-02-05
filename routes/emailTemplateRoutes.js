//importing modules
const express = require("express");
const emailController = require("../controllers/emailTemplatesController");
const { resolver } = require("../connectionResolver/resolver");
const { protect, rolePermission, } = require("../middleware/authController")
const router = express.Router();

router
    .route("/updateEmailTemplates")
    .put(resolver, rolePermission, emailController.updateEmailTemplates)

router
    .route("/getEmailTemplates")
    .get(resolver, rolePermission, emailController.getEmailTemplates)

module.exports = router;