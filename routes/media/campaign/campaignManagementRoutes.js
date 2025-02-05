//importing modules
const express = require("express");
const campaignManagementController = require("../../../controllers/media/Campaign/campaignManagementController");
const { resolver } = require("../../../connectionResolver/resolver");
const { protect, rolePermission } = require("../../../middleware/authController")
const router = express.Router();

//admin routes
router
    .route("/addCampaign")
    .post(resolver, rolePermission, campaignManagementController.addCampaign)

router
    .route("/getCampaign")
    .get(resolver, rolePermission, campaignManagementController.getCampaign)

router
    .route("/updateCampaign")
    .put(resolver, rolePermission, campaignManagementController.updateCampaign)

router
    .route("/deleteCampaign")
    .delete(resolver, rolePermission, campaignManagementController.deleteCampaign)

router
    .route("/uploadPOPdf")
    .put(resolver, rolePermission, campaignManagementController.uploadPOPdf)

module.exports = router;