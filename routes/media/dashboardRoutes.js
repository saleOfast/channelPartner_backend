//importing modules
const express = require("express");
const Controller = require("../../controllers/media/dashboardController.js");
const { resolver } = require("../../connectionResolver/resolver.js");
const { protect, rolePermission } = require("../../middleware/authController.js")
const router = express.Router();

//admin routes
router
    .route("/getSalesOrder")
    .get(resolver, rolePermission, Controller.getSalesOrder)

router
    .route("/getSalesOrderByCreater")
    .get(resolver, rolePermission, Controller.getSalesOrderByCreater)

router
    .route("/getPurchaseOrder")
    .get(resolver, rolePermission, Controller.getPurchaseOrder)

router
    .route("/getSitesByAvailabiltyStatus")
    .get(resolver, rolePermission, Controller.getSitesByAvailabiltyStatus)

router
    .route("/getSitesByCategory")
    .get(resolver, rolePermission, Controller.getSitesByCategory)


module.exports = router;