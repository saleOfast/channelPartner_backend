//importing modules
const express = require("express");
const Controller = require("../../controllers/media/ndpReasonController.js");
const { resolver } = require("../../connectionResolver/resolver.js");
const { protect, rolePermission } = require("../../middleware/authController.js")
const router = express.Router();

//admin routes
router
    .route("/addNDPReason")
    .post(resolver, rolePermission, Controller.addNDPReason)

router
    .route("/getNDPReason")
    .get(resolver, rolePermission, Controller.getNDPReason)

router
    .route("/updateNDPReason")
    .put(resolver, rolePermission, Controller.updateNDPReason)

router
    .route("/deleteNDPReason")
    .delete(resolver, rolePermission, Controller.deleteNDPReason)

module.exports = router;