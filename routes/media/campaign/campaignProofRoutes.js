//importing modules
const express = require("express");
const campaignProofController = require("../../../controllers/media/Campaign/campaignProofController");
const { resolver } = require("../../../connectionResolver/resolver");
const { protect, rolePermission } = require("../../../middleware/authController")
const router = express.Router();

//admin routes
router
    .route("/addCampaignProof")
    .post(resolver, rolePermission, campaignProofController.addCampaignProof)

router
    .route("/getCampaignProof")
    .get(resolver, rolePermission, campaignProofController.getCampaignProof)

router
    .route("/updateCampaignProof")
    .put(resolver, rolePermission, campaignProofController.updateCampaignProof)

router
    .route("/deleteCampaignProof")
    .delete(resolver, rolePermission, campaignProofController.deleteCampaignProof)

module.exports = router;