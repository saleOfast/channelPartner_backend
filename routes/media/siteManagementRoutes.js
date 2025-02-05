//importing modules
const express = require("express");
const siteManagementController = require("../../controllers/media/siteManagementController");
const { resolver } = require("../../connectionResolver/resolver");
const { protect, rolePermission } = require("../../middleware/authController")
const { userValidationRules, validate } = require('../../validator/validation');
const router = express.Router();

//admin routes
router
    .route("/addSiteCategory")
    .post(resolver, rolePermission, siteManagementController.addSiteCategory)

router
    .route("/getSiteCategory")
    .get(resolver, rolePermission, siteManagementController.getSiteCategory)

router
    .route("/updateSiteCategory")
    .put(resolver, rolePermission, siteManagementController.updateSiteCategory)

router
    .route("/deleteSiteCategory")
    .delete(resolver, rolePermission, siteManagementController.deleteSiteCategory)

router
    .route("/addSite")
    .post(resolver, rolePermission, siteManagementController.addSite)

router
    .route("/getSite")
    .get(resolver, rolePermission, siteManagementController.getSite)

router
    .route("/updateSite")
    .put(resolver, rolePermission, siteManagementController.updateSite)

router
    .route("/deleteSite")
    .delete(resolver, rolePermission, siteManagementController.deleteSite)

module.exports = router;