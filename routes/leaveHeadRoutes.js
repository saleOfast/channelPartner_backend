//importing modules
const express = require("express");
const leaveHeadController = require("../controllers/leaveHeadController");
const {resolver} = require("../connectionResolver/resolver");
const { rolePermission ,} = require("../middleware/authController")
const router = express.Router();


//admin routes
router
    .route("/")
        .post(resolver, rolePermission , leaveHeadController.storeleaveHead)
        .put(resolver, rolePermission , leaveHeadController.editleaveHead)
        .get(resolver, rolePermission, leaveHeadController.getleaveHead)
        .delete(resolver, rolePermission , leaveHeadController.deleteleaveHead)

router
    .route("/count")
        .post(resolver,  rolePermission  , leaveHeadController.storeleaveHeadCount)
        .put(resolver,  rolePermission  , leaveHeadController.editleaveHeadCount)
        .get(resolver,  rolePermission , leaveHeadController.getleaveHeadOfCurrentYaer)
        .delete(resolver,  leaveHeadController.deleteleaveHeadCount)

module.exports = router;