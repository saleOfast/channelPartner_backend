//importing modules
const express = require("express");
const controller = require("../../controllers/channel/leadVisitController");
const {resolver} = require("../../connectionResolver/resolver");
const router = express.Router();


//admin routes
router
    .route("/")
        .post(resolver,  controller.createLeadVisit)
        .put(resolver,   controller.editleadsVisit)
        .get(resolver,  controller.getleadsVisit)
        .delete(resolver,   controller.deleteVisit)

router
    .route("/getRevisitHistory")
        .get(resolver,  controller.getRevisitHistory)

module.exports = router;