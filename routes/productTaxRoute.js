//importing modules
const express = require("express");
const productTaxController = require("../controllers/productTaxController");
const {resolver} = require("../connectionResolver/resolver");
const { rolePermission} = require("../middleware/authController");
const router = express.Router();


//admin routes
router
    .route("/")
        .post(resolver,  rolePermission, productTaxController.storeProductTax)
        .put(resolver, productTaxController.editProductTax)
        .get(resolver,  rolePermission ,productTaxController.getProductTax)
        .delete(resolver,  rolePermission, productTaxController.deleteProductTax)

router
    .route("/quatationTax")
        .get(resolver, productTaxController.getQuatationProductTax)

module.exports = router;