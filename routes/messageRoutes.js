//importing modules
const express = require("express");
const messageController = require("../controllers/messageController");
const {protect} = require('../middleware/authController')
const router = express.Router();


//admin routes
router
    .route("/")
        .post(messageController.sendNotification) // Route to get all category at once

module.exports = router;