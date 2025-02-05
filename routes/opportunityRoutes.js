//importing modules
const express = require("express");
const opportunityController = require("../controllers/opportunityController");
const reportOpportunityController = require("../controllers/reportController");
const { resolver } = require("../connectionResolver/resolver");
const { rolePermission } = require("../middleware/authController")
const router = express.Router();
const { userValidationRules, validate, superValidate } = require('../validator/validation');


//admin routes
router
    .route("/")
    .post(resolver, rolePermission, userValidationRules("addOpp"), validate, opportunityController.storeOpportunity)
    .put(resolver, rolePermission, userValidationRules("editOpp"), validate, opportunityController.editOpportunity)
    .get(resolver, rolePermission, opportunityController.getOpportunity)
    .delete(resolver, rolePermission, userValidationRules("deleteOpp"), validate, opportunityController.deleteOpportunity)

router
    .route("/download")
    .get(resolver, rolePermission, opportunityController.downloadExcelData)

router
    .route("/field").post(resolver, opportunityController.storeExtraOpportunity)

router
    .route("/opportunityReport")
    .get(resolver, rolePermission, reportOpportunityController.getOpportunity)

router
    .route("/opportunityReport/downloadExcelData")
    .get(resolver, reportOpportunityController.downloadExcelData)

router
    .route("/getOpportunityRatio")
    .get(resolver, rolePermission, reportOpportunityController.getOpportunityRatio)

router
    .route("/getOpportunityRatio/downloadExcelDataRatio")
    .get(resolver, reportOpportunityController.downloadExcelDataOpportunityRatio)

router
    .route("/getAverageClosingTime")
    .get(resolver, rolePermission, reportOpportunityController.getAverageClosingTime)

router
    .route("/getAverageClosingTime/downloadExcelDataAverageClosingTime")
    .get(resolver, rolePermission, reportOpportunityController.downloadExcelDataAverageClosingTime)

module.exports = router;