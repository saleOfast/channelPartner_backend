//importing modules
const express = require("express");
const productController = require("../controllers/productController");
const { resolver } = require("../connectionResolver/resolver");
const { rolePermission } = require("../middleware/authController");
const router = express.Router();
const {
  userValidationRules,
  validate,
  superValidate,
} = require("../validator/validation");

//admin routes
router
  .route("/")
  .post(
    resolver,
    rolePermission,
    userValidationRules("addProduct"),
    validate,
    productController.storeProduct
  )
  .put(
    resolver,
    rolePermission,
    userValidationRules("editProduct"),
    validate,
    productController.editProduct
  )
  .get(resolver, rolePermission, productController.getProduct)
  .delete(
    resolver,
    rolePermission,
    userValidationRules("deleteProduct"),
    validate,
    productController.deleteProduct
  );

router.route("/getShopItems").get(resolver, productController.getShopItems);
router.route("/download").get(resolver, productController.downloadExcelData)
;
router
  .route("/bulk")
  .post(resolver, rolePermission, productController.registerBulkProduct);

module.exports = router;
