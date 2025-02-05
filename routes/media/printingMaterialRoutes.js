//importing modules
const express = require("express");
const printingMaterialController = require("../../controllers/media/printingMaterialController.js");
const { resolver } = require("../../connectionResolver/resolver");
const { protect, rolePermission } = require("../../middleware/authController")
const router = express.Router();

//admin routes
router
    .route("/addPrintingMaterial")
    .post(resolver, rolePermission,printingMaterialController.addPrintingMaterial)

router
    .route("/getPrintingMaterial")
    .get(resolver, rolePermission,printingMaterialController.getPrintingMaterial)

router
    .route("/updatePrintingMaterial")
    .put(resolver, rolePermission,printingMaterialController.updatePrintingMaterial)

router
    .route("/deletePrintingMaterial")
    .delete(resolver, rolePermission,printingMaterialController.deletePrintingMaterial)

module.exports = router;