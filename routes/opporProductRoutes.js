//importing modules
const express = require("express");
const opprProduct = require("../controllers/opprProduct");
const {resolver} = require("../connectionResolver/resolver");
const { rolePermission ,} = require("../middleware/authController");
const router = express.Router();


//admin routes
router
    .route("/")
        .post(resolver,  opprProduct.createProductArr)
        .put(resolver,  opprProduct.editProductByPkey)
        .get(resolver,  opprProduct.getAllProductByOpportunity)
        .delete(resolver,  opprProduct.deleteProductByPkey)

module.exports = router;