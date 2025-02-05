//importing modules
const express = require("express");
const campaignStatusController = require("../../../controllers/media/Campaign/campaignStatusController");
const { resolver } = require("../../../connectionResolver/resolver");
const { protect, rolePermission } = require("../../../middleware/authController")
const router = express.Router();

//admin routes
router
    .route("/addCampaignStatus")
    .post(resolver, rolePermission, campaignStatusController.addCampaignStatus)

router
    .route("/getCampaignStatus")
    .get(resolver, rolePermission, campaignStatusController.getCampaignStatus)

router
    .route("/updateCampaignStatus")
    .put(resolver, rolePermission, campaignStatusController.updateCampaignStatus)

router
    .route("/deleteCampaignStatus")
    .delete(resolver, rolePermission, campaignStatusController.deleteCampaignStatus)

module.exports = router;