//importing modules
const express = require("express");
const siteStatusController = require("../../controllers/media/siteStatusController");
const { resolver } = require("../../connectionResolver/resolver");
const { protect, rolePermission } = require("../../middleware/authController")
const router = express.Router();

//admin routes
router
    .route("/addSiteStatus")
    .post(resolver, rolePermission, siteStatusController.addSiteStatus)

router
    .route("/getSiteStatus")
    .get(resolver, rolePermission, siteStatusController.getSiteStatus)

router
    .route("/updateSiteStatus")
    .put(resolver, rolePermission, siteStatusController.updateSiteStatus)

router
    .route("/deleteSiteStatus")
    .delete(resolver, rolePermission, siteStatusController.deleteSiteStatus)

module.exports = router;