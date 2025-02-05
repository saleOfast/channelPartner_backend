//importing modules
const express = require("express");
const printingCostController = require("../../controllers/media/printingCostController.js");
const { resolver } = require("../../connectionResolver/resolver.js");
const { protect, rolePermission } = require("../../middleware/authController.js")
const router = express.Router();

//admin routes
router
    .route("/addPrintingCost")
    .post(resolver, rolePermission, printingCostController.addPrintingCost)

router
    .route("/getPrintingCost")
    .get(resolver, rolePermission, printingCostController.getPrintingCost)

router
    .route("/updatePrintingCost")
    .put(resolver, rolePermission, printingCostController.updatePrintingCost)

router
    .route("/deletePrintingCost")
    .delete(resolver, rolePermission, printingCostController.deletePrintingCost)

module.exports = router;