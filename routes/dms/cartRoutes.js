const express = require("express");
const { resolver } = require("../../connectionResolver/resolver");
const { protect, rolePermission } = require("../../middleware/authController");
const cartController = require("../../controllers/dms/cartController");
const { userValidationRules, validate } = require("../../validator/validation");

const router = express.Router();

router
  .route("/")
  .get(resolver, cartController.getList)
  .post(resolver, cartController.incrementCart)
  .delete(resolver, cartController.deleteCartItem)
  .put(resolver, cartController.decrementCart);

router.route("/clearCart").delete(resolver, cartController.clearCart);

module.exports = router;
