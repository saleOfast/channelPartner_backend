//importing modules
const express = require("express");
const controller = require("../../controllers/channel/bookingController");
const {resolver} = require("../../connectionResolver/resolver");
const router = express.Router();


//admin routes
router
    .route("/")
        .get(resolver,  controller.getleadBooking)

module.exports = router;