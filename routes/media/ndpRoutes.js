//importing modules
const express = require("express");
const Controller = require("../../controllers/media/ndpController.js");
const { resolver } = require("../../connectionResolver/resolver.js");
const { protect, rolePermission } = require("../../middleware/authController.js")
const router = express.Router();

//admin routes
router
    .route("/addNDP")
    .post(resolver, rolePermission, Controller.addNDP)

router
    .route("/getNDP")
    .get(resolver, rolePermission, Controller.getNDP)

router
    .route("/updateNDP")
    .put(resolver, rolePermission, Controller.updateNDP)

router
    .route("/deleteNDP")
    .delete(resolver, rolePermission, Controller.deleteNDP)

module.exports = router;