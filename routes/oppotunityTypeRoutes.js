//importing modules
const express = require("express");
const opportunityTypeController = require("../controllers/opportunityTypeController");
const {resolver} = require("../connectionResolver/resolver");
const { rolePermission ,} = require("../middleware/authController")
const router = express.Router();


//admin routes
router
    .route("/")
        .post(resolver,  rolePermission , opportunityTypeController.storeOppType)
        .put(resolver,  rolePermission , opportunityTypeController.editOppType)
        .get(resolver,  rolePermission , opportunityTypeController.getOppType)
        .delete(resolver,  rolePermission , opportunityTypeController.deleteOppType)

module.exports = router;