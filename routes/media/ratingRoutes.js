//importing modules
const express = require("express");
const ratingController = require("../../controllers/media/ratingController.js");
const { resolver } = require("../../connectionResolver/resolver");
const { protect, rolePermission } = require("../../middleware/authController")
const router = express.Router();

//admin routes
router
    .route("/addRating")
    .post(resolver, rolePermission, ratingController.addRating)

router
    .route("/getRating")
    .get(resolver, rolePermission, ratingController.getRating)

router
    .route("/updateRating")
    .put(resolver, rolePermission, ratingController.updateRating)

router
    .route("/deleteRating")
    .delete(resolver, rolePermission, ratingController.deleteRating)

module.exports = router;