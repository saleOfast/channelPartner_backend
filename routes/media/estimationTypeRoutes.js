//importing modules
const express = require("express");
const Controller = require("../../controllers/media/estimationTypeController.js");
const { resolver } = require("../../connectionResolver/resolver.js");
const { protect, rolePermission } = require("../../middleware/authController.js")
const router = express.Router();

//admin routes
router
    .route("/addEstimationType")
    .post(resolver, rolePermission, Controller.addEstimationType)

router
    .route("/getEstimationType")
    .get(resolver, rolePermission, Controller.getEstimationType)

router
    .route("/updateEstimationType")
    .put(resolver, rolePermission, Controller.updateEstimationType)

router
    .route("/deleteEstimationType")
    .delete(resolver, rolePermission, Controller.deleteEstimationType)

module.exports = router;