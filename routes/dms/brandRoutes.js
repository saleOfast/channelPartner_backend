const express = require("express");
const { resolver } = require("../../connectionResolver/resolver");
const { protect, rolePermission } = require("../../middleware/authController");
const routeController = require("../../controllers/dms/brandController");
const {
  userValidationRules,
  validate,
} = require("../../validator/validation");

const router = express.Router();

// Admin Routes

router
  .route("/")
  .get(resolver, routeController.getList)
  .post(resolver, userValidationRules('brandCreate'), validate, routeController.createBrand)
  .put(resolver,  userValidationRules('brandUpdate'), validate, routeController.updateBrand)
  .delete(resolver, routeController.deleteBrand);

router.route("/getById").get(resolver, routeController.getById);

module.exports = router;
