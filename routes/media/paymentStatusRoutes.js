//importing modules
const express = require("express");
const PaymentStatusController = require("../../controllers/media/paymentStatusController.js");
const { resolver } = require("../../connectionResolver/resolver.js");
const { protect, rolePermission } = require("../../middleware/authController.js")
const router = express.Router();

router
    .route("/addPaymentStatus")
    .post(resolver, rolePermission, PaymentStatusController.addPaymentStatus)

router
    .route("/getPaymentStatus")
    .get(resolver, rolePermission, PaymentStatusController.getPaymentStatus)

router
    .route("/updatePaymentStatus")
    .put(resolver, rolePermission, PaymentStatusController.updatePaymentStatus)

router
    .route("/deletePaymentStatus")
    .delete(resolver, rolePermission, PaymentStatusController.deletePaymentStatus)

module.exports = router;