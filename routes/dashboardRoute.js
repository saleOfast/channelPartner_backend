//importing modules
const express = require("express");
const dashboardController = require("../controllers/dashboardController");
const {resolver} = require("../connectionResolver/resolver");
const {protect} = require("../middleware/authController");
const router = express.Router();


//admin routes
router
    .route("/")
        .get(resolver,  dashboardController.getContact)
router
    .route("/getcountData")
        .get(resolver,  dashboardController.getPlatformPermissionCount)
router
    .route("/getcountRev")
        .get(resolver,  dashboardController.getPlatformPermissionCountReverse)
module.exports = router;