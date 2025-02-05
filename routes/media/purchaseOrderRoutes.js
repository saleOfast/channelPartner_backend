//importing modules
const express = require("express");
const purchaseOrderController = require("../../controllers/media/purchaseOrderController");
const { resolver } = require("../../connectionResolver/resolver");
const { protect, rolePermission } = require("../../middleware/authController")
const router = express.Router();

//admin routes
router
    .route("/addPurchaseOrder")
    .post(resolver, rolePermission, purchaseOrderController.addPurchaseOrder)

router
    .route("/getPurchaseOrder")
    .get(resolver, rolePermission, purchaseOrderController.getPurchaseOrder)

router
    .route("/updatePurchaseOrder")
    .put(resolver, rolePermission, purchaseOrderController.updatePurchaseOrder)

router
    .route("/deletePurchaseOrder")
    .delete(resolver, rolePermission, purchaseOrderController.deletePurchaseOrder)

router
    .route("/fetchPurchaseOrder")
    .get(resolver, rolePermission, purchaseOrderController.fetchPurchaseOrder)

module.exports = router;