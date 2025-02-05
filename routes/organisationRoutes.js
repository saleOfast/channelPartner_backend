//importing modules
const express = require("express");
const organisationController = require("../controllers/organisationInfoController");
const { resolver } = require("../connectionResolver/resolver");
const { protect, rolePermission, } = require("../middleware/authController")
const router = express.Router();

router
    .route("/addOrganisation")
    .post(resolver, rolePermission, organisationController.addOrganisation)

router
    .route("/getOrganisation")
    .get(resolver, rolePermission, organisationController.getOrganisation)

router
    .route("/updateOrganisation")
    .put(resolver, rolePermission, organisationController.updateOrganisation)

router
    .route("/deleteOrganisation")
    .delete(resolver, rolePermission, organisationController.deleteOrganisation)

module.exports = router;