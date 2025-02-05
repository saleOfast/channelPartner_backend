//importing modules
const express = require("express");
const salesOrderController = require("../../controllers/media/salesOrderController.js");
const { resolver } = require("../../connectionResolver/resolver.js");
const { protect, rolePermission } = require("../../middleware/authController.js")
const router = express.Router();

router
    .route("/addSalesOrder")
    .post(resolver, rolePermission, salesOrderController.addSalesOrder)

router
    .route("/getSalesOrder")
    .get(resolver, rolePermission, salesOrderController.getSalesOrder)

router
    .route("/updateSalesOrder")
    .put(resolver, rolePermission, salesOrderController.updateSalesOrder)

router
    .route("/deleteSalesOrder")
    .delete(resolver, rolePermission, salesOrderController.deleteSalesOrder)

module.exports = router;