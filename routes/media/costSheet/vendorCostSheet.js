//importing modules
const express = require("express");
const { userValidationRules, validate } = require("../../../validator/validation");
const { createAssetVendorCostSheet, updateAssetVendorCostSheet, getAssetVendorCostSheet, deleteAssetVendorCostSheet, getCostSheetsData } = require("../../../controllers/media/costSheets/assetVendorCostSheetController");
const { createAgencyVendorCostSheet, updateAgencyVendorCostSheet, getAgencyVendorCostSheet, deleteAgencyVendorCostSheet, getAgencyCostSheetsData } = require("../../../controllers/media/costSheets/agencyVendorCostSheetController");
const { resolver } = require("../../../connectionResolver/resolver");
const { protect, rolePermission } = require("../../../middleware/authController")
const router = express.Router();

//admin routes
router
  .route("/createAssetVendorCostSheet")
  .post(resolver, rolePermission, /*userValidationRules("AssetvendorCostSheetUpdate")*/ createAssetVendorCostSheet);

router
  .route("/getAssetVendorCostSheet")
  .get(resolver, rolePermission, getAssetVendorCostSheet);

router
  .route("/getCostSheetsData")
  .get(resolver, rolePermission, getCostSheetsData);

router
  .route("/getAgencyCostSheetsData")
  .get(resolver, rolePermission, getAgencyCostSheetsData);

router
  .route("/updateAssetVendorCostSheet")
  .put(resolver, rolePermission, /*userValidationRules("AssetvendorCostSheetUpdate")*/ updateAssetVendorCostSheet);

router
  .route("/deleteAssetVendorCostSheet")
  .delete(resolver, rolePermission, deleteAssetVendorCostSheet);

router
  .route("/createAgencyVendorCostSheet")
  .post(resolver, rolePermission, /*userValidationRules("AgencyvendorCostSheetUpdate")*/ createAgencyVendorCostSheet);

router
  .route("/getAgencyVendorCostSheet")
  .get(resolver, rolePermission, getAgencyVendorCostSheet);

router
  .route("/updateAgencyVendorCostSheet")
  .put(resolver, rolePermission, /*userValidationRules("AgencyvendorCostSheetUpdate")*/ updateAgencyVendorCostSheet);

router
  .route("/deleteAgencyVendorCostSheet")
  .delete(resolver, rolePermission, deleteAgencyVendorCostSheet);

module.exports = router;
