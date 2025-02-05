//importing modules
const express = require("express");
const designationController = require("../controllers/designationController");
const {resolver} = require("../connectionResolver/resolver");
const {protect , rolePermission ,} = require("../middleware/authController")
const router = express.Router();


//admin routes
router
    .route("/")
        .post(resolver,  rolePermission , designationController.storeDesignation)
        .put(resolver,  rolePermission , designationController.editDesignation)
        .get(resolver,  rolePermission , designationController.getDesignation)
        .delete(resolver,  rolePermission , designationController.deleteDesignation)
router
    .route("/bulk")
        .post(resolver,  rolePermission , designationController.storeBulkDesignation)
module.exports = router;