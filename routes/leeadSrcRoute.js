//importing modules
const express = require("express");
const leadSourceController = require("../controllers/leadSourceController");
const {resolver} = require("../connectionResolver/resolver");
const { rolePermission ,} = require("../middleware/authController")
const router = express.Router();


//admin routes
router
    .route("/")
        .post(resolver,  rolePermission , leadSourceController.storeLeadSrc)
        .put(resolver,  rolePermission , leadSourceController.editLeadSrc)
        .get(resolver,  rolePermission , leadSourceController.getLeadSrc)
        .delete(resolver,  rolePermission , leadSourceController.deleteLeadSrc)

module.exports = router;