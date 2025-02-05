//importing modules
const express = require("express");
const estimationController = require("../../controllers/media/estimateStatusController.js");
const { resolver } = require("../../connectionResolver/resolver.js");
const { protect, rolePermission } = require("../../middleware/authController.js")
const router = express.Router();

//admin routes
router
    .route("/addEstimationStatus")
    .post(resolver, rolePermission, estimationController.addEstimateStatus)

router
    .route("/getEstimationStatus")
    .get(resolver, rolePermission, estimationController.getEstimateStatus)

router
    .route("/updateEstimationStatus")
    .put(resolver, rolePermission, estimationController.updateEstimateStatus)

router
    .route("/deleteEstimationStatus")
    .delete(resolver, rolePermission, estimationController.deleteEstimateStatus)

module.exports = router;