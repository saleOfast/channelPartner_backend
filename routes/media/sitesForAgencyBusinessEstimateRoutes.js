//importing modules
const express = require("express");
const estimationForAssetController = require("../../controllers/media/sitesForAgencyBusinessEstimateController.js");
const { resolver } = require("../../connectionResolver/resolver.js");
const { protect, rolePermission } = require("../../middleware/authController.js")
const router = express.Router();

//admin routes
router
    .route("/addSitesForAgencyEstimates")
    .post(resolver, rolePermission, estimationForAssetController.addSitesForAgencyEstimates)

router
    .route("/getSitesForAgencyEstimates")
    .get(resolver, rolePermission, estimationForAssetController.getSitesForAgencyEstimates)

router
    .route("/updateSitesForAgencyEstimates")
    .put(resolver, rolePermission, estimationForAssetController.updateSitesForAgencyEstimates)

router
    .route("/deleteSitesForAgencyEstimates")
    .delete(resolver, rolePermission, estimationForAssetController.deleteSitesForAgencyEstimates)

module.exports = router;