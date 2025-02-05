//importing modules
const express = require("express");
const controller = require("../../controllers/channel/channelLeadController");
const {resolver} = require("../../connectionResolver/resolver");
const {userValidationRules, validate } = require('../../validator/validation');
const router = express.Router();


//admin routes
router
    .route("/")
        .post(resolver, userValidationRules('addChannelLead'), validate, controller.storeChannelLead)
        .put(resolver, userValidationRules('editChannelLead'), validate,   controller.editleads)
        .get(resolver,  controller.getleads)
        .delete(resolver,   controller.deleteleads)

router
  .route("/delete")
  .put(resolver, controller.deleteLeadByID)   
        

router
    .route("/projects")
        .post(resolver,controller.fetchOrderNO)
        .get(resolver,controller.getProjectList)

router
    .route("/location").get(resolver,  controller.getLeadLocationList)

module.exports = router;