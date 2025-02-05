const express = require("express");
const settingsController = require("../controllers/generalSettingsController");
const { resolver } = require("../connectionResolver/resolver");
const router = express.Router();

router
  .route("/generalSettings")
  .get(resolver, settingsController.getGeneralSettings)
  .post(resolver, settingsController.addGeneralSettings)
  .put(resolver, settingsController.editGeneralSettings)

router
  .route("/generalSettings/getCurrencies")
  .get(resolver, settingsController.getCurrencies)

module.exports = router;
