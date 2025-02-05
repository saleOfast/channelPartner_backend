//importing modules
const express = require("express");
const estimationForAssetController = require("../../controllers/media/estimationForAssetController.js");
const { resolver } = require("../../connectionResolver/resolver.js");
const { protect, rolePermission } = require("../../middleware/authController.js")
const router = express.Router();

//admin routes
router
    .route("/addEstimationAssetBusiness")
    .post(resolver, rolePermission, estimationForAssetController.addEstimationAssetBusiness)

router
    .route("/getEstimationAssetBusiness")
    .get(resolver, rolePermission, estimationForAssetController.getEstiamtionAssetBusiness)

router
    .route("/updateEstimationAssetBusiness")
    .put(resolver, rolePermission, estimationForAssetController.updateEstiamtionAssetBusiness)

router
    .route("/deleteEstimationAssetBusiness")
    .delete(resolver, rolePermission, estimationForAssetController.deleteEstiamtionAssetBusiness)

module.exports = router;