const express = require("express");
const { resolver } = require("../../connectionResolver/resolver");
const { protect, rolePermission } = require("../../middleware/authController");
const routeController = require("../../controllers/dms/orderController");
const router = express.Router();

// Admin Routes

router
  .route("/")
  .get(resolver, routeController.getAllOrderOfUser)
  .post(resolver, routeController.createOrder)

module.exports = router;
