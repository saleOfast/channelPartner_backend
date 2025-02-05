//importing modules
const express = require("express");
const mediaFormatController = require("../../controllers/media/mediaFormatController");
const { resolver } = require("../../connectionResolver/resolver");
const { protect, rolePermission } = require("../../middleware/authController")
const { userValidationRules, validate } = require('../../validator/validation');
const router = express.Router();

//admin routes
router
    .route("/addMediaFormat")
    .post(resolver, rolePermission, mediaFormatController.addMediaFormat)

router
    .route("/getMediaFormat")
    .get(resolver, rolePermission, mediaFormatController.getMediaFormat)

router
    .route("/updateMediaFormat")
    .put(resolver, rolePermission, mediaFormatController.updateMediaFormat)

router
    .route("/deleteMediaFormat")
    .delete(resolver, rolePermission, mediaFormatController.deleteMediaFormat)

module.exports = router;