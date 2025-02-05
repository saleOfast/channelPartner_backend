const express = require("express");
const { resolver } = require("../../connectionResolver/resolver");
const { protect, rolePermission } = require("../../middleware/authController");
const routeController = require("../../controllers/dms/bannnerController");
const {
  userValidationRules,
  validate,
} = require("../../validator/validation");
const { dmsValidationRules } = require("../../validator/dmsValidation");

const router = express.Router();

// Admin Routes

router
  .route("/")
  .get(resolver, routeController.getList)
  .post(resolver, dmsValidationRules('banner_create'), validate, routeController.createBanner)
  .put(resolver,  dmsValidationRules('banner_update'), validate, routeController.updateBanner)
  .delete(resolver, routeController.deleteBanner);

router.route("/getById").get(resolver, routeController.getById);

module.exports = router;
