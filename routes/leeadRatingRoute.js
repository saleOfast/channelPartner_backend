//importing modules
const express = require("express");
const leadRatingController = require("../controllers/leadRatingController");
const {resolver} = require("../connectionResolver/resolver");
const { rolePermission} = require("../middleware/authController")
const router = express.Router();


//admin routes
router
    .route("/")
        .post(resolver,  rolePermission , leadRatingController.storeLeadRating)
        .put(resolver,  rolePermission , leadRatingController.editLeadRating)
        .get(resolver,  rolePermission , leadRatingController.getLeadRating)
        .delete(resolver,  rolePermission , leadRatingController.deleteLeadRating)

module.exports = router;