//importing modules
const express = require("express");
const opportunityStageController = require("../controllers/opportunityStageController");
const {resolver} = require("../connectionResolver/resolver");
const { rolePermission ,} = require("../middleware/authController")
const router = express.Router();


//admin routes
router
    .route("/")
        .post(resolver,  rolePermission , opportunityStageController.storeOppStg)
        .put(resolver,  rolePermission , opportunityStageController.editOppStg)
        .get(resolver,  rolePermission , opportunityStageController.getOppStg)
        .delete(resolver,  rolePermission , opportunityStageController.deleteOppStg)

module.exports = router;