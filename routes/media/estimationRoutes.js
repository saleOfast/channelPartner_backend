//importing modules
const express = require("express");
const estimationController = require("../../controllers/media/estimationController.js");
const { resolver } = require("../../connectionResolver/resolver.js");
const { protect, rolePermission } = require("../../middleware/authController.js")
const router = express.Router();

//admin routes
router
    .route("/addEstimation")
    .post(resolver, rolePermission, estimationController.addEstimation)

router
    .route("/getEstimation")
    .get(resolver, rolePermission, estimationController.getEstimation)

router
    .route("/updateEstimation")
    .put(resolver, rolePermission, estimationController.updateEstimation)

router
    .route("/deleteEstimation")
    .delete(resolver, rolePermission, estimationController.deleteEstimation)

router
    .route("/sendMailForApproval")
    .post(resolver, rolePermission, estimationController.sendMailForApproval)

router
    .route("/approveEstimate")
    .post(resolver, rolePermission, estimationController.approveEstimate)

router
    .route("/addReprintEstimate")
    .post(resolver, rolePermission, estimationController.addReprintEstimate)

router
    .route("/proformaInvoice")
    .get(resolver, rolePermission, estimationController.proformaInvoice)

router
    .route("/getSiteBookingHistory")
    .get(resolver, rolePermission, estimationController.getSiteBookingHistory)

module.exports = router;