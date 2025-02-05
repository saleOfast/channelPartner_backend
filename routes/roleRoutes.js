//importing modules
const express = require("express");
const roleController = require("../controllers/roleController");
const {resolver} = require("../connectionResolver/resolver");
const { rolePermission} = require("../middleware/authController")
const router = express.Router();


//admin routes
router
    .route("/")
        .post( resolver,  rolePermission, roleController.storeRole)
        .put(resolver,  rolePermission, roleController.editRole)
        .get(resolver,  rolePermission, roleController.getRole)
        .delete(resolver,  rolePermission, roleController.deleteRole)

router
    .route("/one")
        .get(resolver, rolePermission, roleController.getRoleOne)

module.exports = router;