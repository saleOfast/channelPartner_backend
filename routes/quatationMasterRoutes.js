//importing modules
const express = require("express");
const quatationMasterController = require("../controllers/quatationMasterController");
const {resolver} = require("../connectionResolver/resolver");
const {  rolePermission,} = require("../middleware/authController");
const router = express.Router();
const {userValidationRules, validate ,superValidate } = require('../validator/validation');



//admin routes
router
    .route("/")
        .post(resolver,   rolePermission, userValidationRules("addQuatation"), validate ,  quatationMasterController.storeQuatMaster)
        .put(resolver,   rolePermission, userValidationRules("editQuotation"), validate , quatationMasterController.editQuatMaster)
        .get(resolver,  rolePermission,quatationMasterController.getQuatMaster)
        .delete(resolver,   rolePermission, quatationMasterController.deleteQuatMaster)
router
    .route("/download")
        .get(resolver,  rolePermission, quatationMasterController.downloadExcelData)
    
module.exports = router;