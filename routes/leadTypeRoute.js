//importing modules
const express = require("express");
const leadTypeController = require("../controllers/leadTypeController");
const {resolver} = require("../connectionResolver/resolver");
const { rolePermission ,} = require("../middleware/authController")
const router = express.Router();


//admin routes
router
    .route("/")
        .post(resolver,  rolePermission , leadTypeController.storeLeadType)
        .put(resolver,  rolePermission , leadTypeController.editLeadType)
        .get(resolver,  rolePermission , leadTypeController.getLeadType)
        .delete(resolver,  rolePermission , leadTypeController.deleteLeadType)

module.exports = router;