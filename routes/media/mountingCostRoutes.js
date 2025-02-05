//importing modules
const express = require("express");
const mountingCostController = require("../../controllers/media/mountingCostController.js");
const { resolver } = require("../../connectionResolver/resolver.js");
const { protect, rolePermission } = require("../../middleware/authController.js")
const router = express.Router();

//admin routes
router
    .route("/addMountingCost")
    .post(resolver, rolePermission, mountingCostController.addMountingCost)

router
    .route("/getMountingCost")
    .get(resolver, rolePermission, mountingCostController.getMountingCost)

router
    .route("/updateMountingCost")
    .put(resolver, rolePermission, mountingCostController.updateMountingCost)

router
    .route("/deleteMountingCost")
    .delete(resolver, rolePermission, mountingCostController.deleteMountingCost)

module.exports = router;