//importing modules
const express = require("express");
const contactController = require("../controllers/contactController");
const { resolver } = require("../connectionResolver/resolver");
const { protect, rolePermission } = require("../middleware/authController");
const { userValidationRules, validate, superValidate } = require('../validator/validation');
const router = express.Router();


//admin routes
router
    .route("/")
    .post(resolver, rolePermission, userValidationRules('addContact'), validate, contactController.storeContact)
    .put(resolver, rolePermission, userValidationRules('editContact'), validate, contactController.editContact)
    .get(resolver, rolePermission, contactController.getContact)
    .delete(resolver, rolePermission, userValidationRules('deleteContact'), validate, contactController.deleteContact)
router
    .route("/download")
    .get(resolver, rolePermission, contactController.downloadExcelData)

router
    .route("/field")
    .post(resolver, contactController.storecontactField)
    .get(resolver, contactController.getcontactField)
module.exports = router;