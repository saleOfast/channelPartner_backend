//importing modules
const express = require("express");
const controller = require("../../controllers/channel/projectController");
const {resolver} = require("../../connectionResolver/resolver");
const router = express.Router();


//admin routes
router
    .route("/")
        .post(resolver,  controller.storeChannelProject)
        .put(resolver,   controller.editChannelProject)
        .get(resolver,  controller.getChannelProject)
        .delete(resolver,   controller.deleteChannelProject)
router
    .route("/usertemplate")
        .post(resolver,  controller.storeUserChannelTemplate)

module.exports = router;