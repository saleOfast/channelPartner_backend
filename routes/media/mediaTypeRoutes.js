//importing modules
const express = require("express");
const mediaTypeController = require("../../controllers/media/mediaTypeController");
const { resolver } = require("../../connectionResolver/resolver");
const { protect, rolePermission } = require("../../middleware/authController")
const { userValidationRules, validate } = require('../../validator/validation');
const router = express.Router();

//admin routes
router
    .route("/addMediaType")
    .post(resolver, rolePermission, mediaTypeController.addMediaType)

router
    .route("/getMediaType")
    .get(resolver, rolePermission, mediaTypeController.getMediaType)

router
    .route("/updateMediaType")
    .put(resolver, rolePermission, mediaTypeController.updateMediaType)

router
    .route("/deleteMediaType")
    .delete(resolver, rolePermission, mediaTypeController.deleteMediaType)

module.exports = router;