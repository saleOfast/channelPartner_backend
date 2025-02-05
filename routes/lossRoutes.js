//importing modules
const express = require("express");
const lossController = require("../controllers/lossController");
const {resolver} = require("../connectionResolver/resolver");
const { rolePermission ,} = require("../middleware/authController");
const router = express.Router();


//admin routes
router
    .route("/")
        .post(resolver,  rolePermission , lossController.storeLoss)
        .put(resolver,  rolePermission , lossController.editLoss)
        .get(resolver,  rolePermission , lossController.getLoss)
        .delete(resolver,  rolePermission , lossController.deleteLoss)

module.exports = router;