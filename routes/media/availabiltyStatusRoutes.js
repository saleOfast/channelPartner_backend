//importing modules
const express = require("express");
const availabiltyStatusController = require("../../controllers/media/availabiltyStatusController");
const { resolver } = require("../../connectionResolver/resolver");
const { protect, rolePermission } = require("../../middleware/authController")
const router = express.Router();

//admin routes
router
    .route("/addAvailabiltyStatus")
    .post(resolver, rolePermission, availabiltyStatusController.addAvailabiltyStatus)

router
    .route("/getAvailabiltyStatus")
    .get(resolver, rolePermission, availabiltyStatusController.getAvailabiltyStatus)

router
    .route("/updateAvailabiltyStatus")
    .put(resolver, rolePermission, availabiltyStatusController.updateAvailabiltyStatus)

router
    .route("/deleteAvailabiltyStatus")
    .delete(resolver, rolePermission, availabiltyStatusController.deleteAvailabiltyStatus)

module.exports = router;