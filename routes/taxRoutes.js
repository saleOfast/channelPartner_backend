//importing modules
const express = require("express");
const taxController = require("../controllers/taxController");
const {resolver} = require("../connectionResolver/resolver");
const { rolePermission} = require("../middleware/authController");
const router = express.Router();


//admin routes
router
    .route("/")
        .post(resolver,  rolePermission, taxController.storeTax)
        .put(resolver,  rolePermission, taxController.editTax)
        .get(resolver,  rolePermission, taxController.getTax)
        .delete(resolver,  rolePermission, taxController.deleteTax)

module.exports = router;