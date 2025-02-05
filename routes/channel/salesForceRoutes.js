//importing modules
const express = require("express");
const controller = require("../../controllers/channel/salesforceController");
const { resolver } = require("../../connectionResolver/resolver");
const router = express.Router();


//admin routes
router
    .route("/token")
    .post(controller.tokenGenration)

//syncing there lead data to ours db
router
    .route("/leads")
    .post(resolver, controller.syncleads)

//syncing there visits data to ours db
router
    .route("/visits")
    .post(resolver, controller.syncleadVisit)

router
    .route("/booking")
    .post(resolver, controller.SyncBooking)
    .put(resolver, controller.SyncBookingUpdate)


module.exports = router;