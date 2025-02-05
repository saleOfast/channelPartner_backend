//importing modules
const express = require("express");
const userLeaveApplicationController = require("../controllers/userLeaveApplicationController");
const {resolver} = require("../connectionResolver/resolver");
const { rolePermission ,} = require("../middleware/authController")
const router = express.Router();
const {userValidationRules,validate} = require('../validator/validation')


//admin routes
router
    .route("/")
        .post(resolver,  rolePermission  , userValidationRules('addUserLeaveApp'),validate, userLeaveApplicationController.storeuserLeaveApps)
        .put(resolver,   userLeaveApplicationController.edituserLeaveApps)
        .get(resolver,  rolePermission, userLeaveApplicationController.getuserLeaveApps)
        .delete(resolver, rolePermission,  userValidationRules('deleteUserLeaveApp'),validate, userLeaveApplicationController.deleteuserLeaveApps)

router
    .route("/status")
        .post(resolver, rolePermission,  userValidationRules('editUserLeaveApp'),validate, userLeaveApplicationController.updateStatusOfLeaveApps)
        .get(resolver,  userLeaveApplicationController.getUserPendingLeavesCount)

router
    .route("/download")
        .get(resolver, rolePermission, userLeaveApplicationController.downloadExcelData)

module.exports = router;