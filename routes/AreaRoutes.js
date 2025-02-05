//importing modules
const express = require("express");
const AreaController = require("../controllers/AreaController");
const {resolver} = require("../connectionResolver/resolver");
const router = express.Router();


//admin routes
router
    .route("/country")
        .post(resolver, AreaController.storeCountry)
        .put(resolver, AreaController.editCountry)
        .get(resolver, AreaController.getCountry)
        .delete(resolver, AreaController.deleteCountry)

router
    .route("/states")
        .post(resolver, AreaController.storeStates)
        .put(resolver, AreaController.editStates)
        .get(resolver, AreaController.getState)
        .delete(resolver, AreaController.deleteStates)

router
    .route("/city")
        .post(resolver, AreaController.storeCity)
        .put(resolver, AreaController.editCity)
        .get(resolver, AreaController.getCityAndDistrict)
        .delete(resolver, AreaController.deleteCity)

router
    .route("/district")
        .post(resolver, AreaController.storeDistrict)
        .put(resolver, AreaController.editDistrict)
        .get(resolver, AreaController.getCityAndDistrict)
        .delete(resolver, AreaController.deleteDistrict)

module.exports = router;