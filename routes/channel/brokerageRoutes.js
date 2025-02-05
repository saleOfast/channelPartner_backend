//importing modules
const express = require("express");
const controller = require("../../controllers/channel/brokerageController");
const {resolver} = require("../../connectionResolver/resolver");
const router = express.Router();


//admin routes
router
    .route("/")
        .get(resolver,  controller.getleadsBrokerage)
        .post(resolver,  controller.createBrokerage)
        .put(resolver,  controller.editleadsBrokerage)

module.exports = router;