const express = require("express");
const { resolver } = require("../../connectionResolver/resolver");
const { protect, rolePermission } = require("../../middleware/authController");
const routeController = require("../../controllers/dms/couponController");
const router = express.Router();

// Admin Routes

router
  .route("/")
  .get(resolver, routeController.getList)
  .post(resolver, routeController.createCoupon)
  .put(resolver, routeController.updateCoupon)
  .delete(resolver, routeController.deleteCoupon);

router.route("/getById").get(resolver, routeController.getById);

module.exports = router;
