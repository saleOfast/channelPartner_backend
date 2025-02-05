//importing modules
const express = require("express");
const quatationStatusController = require("../controllers/quatationStatusController");
const {resolver} = require("../connectionResolver/resolver");
const { rolePermission} = require("../middleware/authController");
const router = express.Router();


//admin routes
router
    .route("/")
        .post(resolver,  rolePermission, quatationStatusController.storeQuatStatus)
        .put(resolver,  rolePermission, quatationStatusController.editQuatStatus)
        .get(resolver,  rolePermission, quatationStatusController.getQuatStatus)
        .delete(resolver,  rolePermission, quatationStatusController.deleteQuatStatus)

module.exports = router;