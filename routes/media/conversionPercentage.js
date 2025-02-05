//importing modules
const express = require("express");
const ConversionPercentageController = require("../../controllers/media/conversionController.js");
const { resolver } = require("../../connectionResolver/resolver.js");
const { protect, rolePermission } = require("../../middleware/authController.js")
const router = express.Router();

router
    .route("/addConversionPercentage")
    .post(resolver, rolePermission, ConversionPercentageController.addConversionPercentage)

router
    .route("/getConversionPercentage")
    .get(resolver, rolePermission, ConversionPercentageController.getConversionPercentage)

router
    .route("/updateConversionPercentage")
    .put(resolver, rolePermission, ConversionPercentageController.updateConversionPercentage)

router
    .route("/deleteConversionPercentage")
    .delete(resolver, rolePermission, ConversionPercentageController.deleteConversionPercentage)

module.exports = router;