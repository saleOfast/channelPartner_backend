//importing modules
const express = require("express");
const campaignBusinessTypeController = require("../../../controllers/media/Campaign/campaignBusinessTypeController");
const { resolver } = require("../../../connectionResolver/resolver");
const { protect, rolePermission } = require("../../../middleware/authController")
const router = express.Router();

//admin routes
router
    .route("/addCampaignBusinessType")
    .post(resolver, rolePermission, campaignBusinessTypeController.addCampaignBusinessType)

router
    .route("/getCampaignBusinessType")
    .get(resolver, rolePermission, campaignBusinessTypeController.getCampaignBusinessType)

router
    .route("/updateCampaignBusinessType")
    .put(resolver, rolePermission, campaignBusinessTypeController.updateCampaignBusinessType)

router
    .route("/deleteCampaignBusinessType")
    .delete(resolver, rolePermission, campaignBusinessTypeController.deleteCampaignBusinessType)

module.exports = router;    