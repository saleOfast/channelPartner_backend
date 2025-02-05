//importing modules
const express = require("express");
const { userValidationRules, validate } = require("../../../validator/validation");
const { createAssetCostSheet, updateAssetCostSheet, getAssetCostSheet, deleteAssetCostSheet, getCostSheetsData } = require("../../../controllers/media/costSheets/assetClientCostSheetController");
const { createAgencyCostSheet, updateAgencyCostSheet, getAgencyCostSheet, deleteAgencyCostSheet, getAgencyCostSheetsData} = require("../../../controllers/media/costSheets/agencyClientCostSheetController");
const { resolver } = require("../../../connectionResolver/resolver");
const { protect, rolePermission } = require("../../../middleware/authController")
const router = express.Router();

//admin routes
router
  .route("/createAssetClientCostSheet")
  .post(resolver, rolePermission, /*userValidationRules("assetCostSheetUpdate")*/ createAssetCostSheet);

router
  .route("/getAssetClientCostSheet")
  .get(resolver, rolePermission, getAssetCostSheet);

router
  .route("/updateAssetClientCostSheet")
  .put(resolver, rolePermission, /*userValidationRules("assetCostSheetUpdate")*/ updateAssetCostSheet);

router
  .route("/deleteAssetClientCostSheet")
  .delete(resolver, rolePermission, deleteAssetCostSheet);

router
  .route("/getCostSheetsData")
  .get(resolver, rolePermission, getCostSheetsData);

router
  .route("/getAgencyCostSheetsData")
  .get(resolver, rolePermission, getAgencyCostSheetsData);

router
  .route("/createAgencyClientCostSheet")
  .post(resolver, rolePermission, /*userValidationRules("agencyCostSheetUpdate")*/ createAgencyCostSheet);

router
  .route("/getAgencyClientCostSheet")
  .get(resolver, rolePermission, getAgencyCostSheet);

router
  .route("/updateAgencyClientCostSheet")
  .put(resolver, rolePermission, /*userValidationRules("agencyCostSheetUpdate")*/ updateAgencyCostSheet);

router
  .route("/deleteAgencyClientCostSheet")
  .delete(resolver, rolePermission, deleteAgencyCostSheet);
module.exports = router;
