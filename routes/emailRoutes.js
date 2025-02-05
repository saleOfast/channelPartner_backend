//importing modules
const express = require("express");
const emailController = require("../controllers/emailController");
const router = express.Router();


//admin routes
router
    .route("/")
        .post( emailController.SendEmail)
        .put( emailController.bulkCreateUpdate)
        .get( emailController.getList)
module.exports = router;