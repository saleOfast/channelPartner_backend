//importing modules
const express = require("express");
const leadStatusController = require("../controllers/leadStatusController");
const {resolver} = require("../connectionResolver/resolver");
const { rolePermission ,} = require("../middleware/authController")
const router = express.Router();


//admin routes
router
    .route("/")
        .post(resolver,  rolePermission , leadStatusController.storeLeadStatus)
        .put(resolver,  rolePermission , leadStatusController.editLeadStatus)
        .get(resolver,  rolePermission , leadStatusController.getLeadStatus)
        .delete(resolver,  rolePermission , leadStatusController.deleteLeadStatus)

module.exports = router;