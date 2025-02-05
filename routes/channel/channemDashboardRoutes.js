//importing modules
const express = require("express");
const controller = require("../../controllers/channel/channelDasboard");
const Admincontroller = require("../../controllers/channel/chanelAdminDashboard");
const {resolver} = require("../../connectionResolver/resolver");
const router = express.Router();


//admin routes
router
    .route("/")
        .get(resolver,  controller.getDashboardData)

router
    .route("/admin")
        .get(resolver,  Admincontroller.getDashboardData)

       

module.exports = router;