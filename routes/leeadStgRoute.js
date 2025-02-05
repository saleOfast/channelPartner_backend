//importing modules
const express = require("express");
const leadStageController = require("../controllers/leadStageController");
const {resolver} = require("../connectionResolver/resolver");
const { rolePermission ,} = require("../middleware/authController")
const router = express.Router();


//admin routes
router
    .route("/")
        .post(resolver,  rolePermission , leadStageController.storeLeadStg)
        .put(resolver,  rolePermission , leadStageController.editLeadStg)
        .get(resolver,  rolePermission , leadStageController.getLeadStg)
        .delete(resolver,  rolePermission , leadStageController.deleteLeadStg)

module.exports = router;