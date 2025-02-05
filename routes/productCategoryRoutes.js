//importing modules
const express = require("express");
const productCatController = require("../controllers/productCatController");
const { resolver } = require("../connectionResolver/resolver");
const { rolePermission } = require("../middleware/authController");
const router = express.Router();

//admin routes
router
  .route("/")
  .post(resolver, rolePermission, productCatController.storeProductCat)
  .put(resolver, rolePermission, productCatController.editProductCat)
  .get(resolver, rolePermission, productCatController.getProductCat)
  .delete(resolver, productCatController.deleteProductCat);
router
  .route("/one")
  .get(resolver, rolePermission, productCatController.getOneProductCat);

router
  .route("/getAllList")
  .get(resolver, rolePermission, productCatController.getAllList);

router
  .route("/all")
  .get(resolver, rolePermission, productCatController.getAllProductCat);
router
  .route("/bulk")
  .post(
    resolver,
    rolePermission,
    productCatController.registerBulkProductCategory
  );

module.exports = router;
