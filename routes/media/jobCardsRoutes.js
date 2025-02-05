//importing modules
const express = require("express");
const JobCardController = require("../../controllers/media/jobCardsController.js");
const { resolver } = require("../../connectionResolver/resolver.js");
const { protect, rolePermission } = require("../../middleware/authController.js")
const router = express.Router();

//admin routes
router
    .route("/addJobCard")
    .post(resolver, rolePermission, JobCardController.addJobCard)

router
    .route("/getJobCard")
    .get(resolver, rolePermission, JobCardController.getJobCard)

router
    .route("/updateJobCard")
    .put(resolver, rolePermission, JobCardController.updateJobCard)

router
    .route("/deleteJobCard")
    .delete(resolver, rolePermission, JobCardController.deleteJobCard)

module.exports = router;