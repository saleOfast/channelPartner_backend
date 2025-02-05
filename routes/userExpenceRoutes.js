//importing modules
const express = require("express");
const expenceController = require("../controllers/expenceController");
const { resolver } = require("../connectionResolver/resolver");
const { rolePermission, } = require("../middleware/authController")
const { userValidationRules, validate } = require('../validator/validation')
const router = express.Router();


//admin routes
router
    .route("/")
    .post(resolver, rolePermission, userValidationRules("addUserExpence"), validate, expenceController.storeuserExpences)
    .put(resolver, rolePermission, userValidationRules("editUserExpence"), validate, expenceController.edituserExpences)
    .get(resolver, rolePermission, expenceController.getuserExpences)
    .delete(resolver, rolePermission, userValidationRules("deleteUserExpence"), validate, expenceController.deleteuserExpences)
router
    .route("/status")
    .put(resolver, rolePermission, expenceController.updateStatusOfUserExpence)
router
    .route("/upload")
    .post(resolver, expenceController.uploadExpenceFile)

router
    .route("/download")
    .get(resolver, rolePermission, expenceController.downloadExcelData)

module.exports = router