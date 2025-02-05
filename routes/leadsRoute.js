//importing modules
const express = require("express");
const leadController = require("../controllers/leadController");
const LeadCallLogController = require("../controllers/LeadCallLogController");
const {resolver} = require("../connectionResolver/resolver");
const { rolePermission} = require("../middleware/authController")
const {userValidationRules, validate ,superValidate } = require('../validator/validation');
const router = express.Router();


//admin routes
router
    .route("/")
        .post(resolver,  rolePermission, userValidationRules('addLead'), validate, leadController.storeLead)
        .put(resolver,  rolePermission, userValidationRules('editLead'), validate, leadController.editLead)
        .get(resolver,  rolePermission, leadController.getLeadList)
        .delete(resolver, userValidationRules('deleteLead'), validate, leadController.deleteLead);

router
    .route("/task")
        .get(resolver,  leadController.getTaskListByLeadID)

router
    .route("/assign_lead")
        .put(resolver, rolePermission, userValidationRules('editLeadAssign'), validate, leadController.editLead)

router
    .route("/download")
        .get(resolver,  leadController.downloadExcelData)
router
    .route("/calls")
        .get(resolver,  LeadCallLogController.getLeadCallLogs)
        .post(resolver,   userValidationRules('addEvent'), validate,  LeadCallLogController.storeLeadCalls)

router
    .route("/field").post(resolver,  leadController.storeExtraLead)



router
    .route("/single")
        .get(resolver,LeadCallLogController.getSingleEvent)
        .put(resolver,  userValidationRules('editEvent'), validate, LeadCallLogController.editEvent)
        .delete(resolver,  userValidationRules('deleteEvent'), validate, LeadCallLogController.deleteEvent)




module.exports = router;