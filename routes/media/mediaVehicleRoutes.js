//importing modules
const express = require("express");
const mediaVehicleController = require("../../controllers/media/mediaVehicleController");
const { resolver } = require("../../connectionResolver/resolver");
const { protect, rolePermission } = require("../../middleware/authController")
const { userValidationRules, validate } = require('../../validator/validation');
const router = express.Router();

//admin routes
router
    .route("/addMediaVehicle")
    .post(resolver, rolePermission, mediaVehicleController.addMediaVehicle)

router
    .route("/getMediaVehicle")
    .get(resolver, rolePermission, mediaVehicleController.getMediaVehicle)

router
    .route("/updateMediaVehicle")
    .put(resolver, rolePermission, mediaVehicleController.updateMediaVehicle)

router
    .route("/deleteMediaVehicle")
    .delete(resolver, rolePermission, mediaVehicleController.deleteMediaVehicle)

module.exports = router;