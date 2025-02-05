//importing modules
const express = require("express");
const userAttendanceController = require("../controllers/userAttendanceController");
const {resolver} = require("../connectionResolver/resolver");
const { rolePermission} = require("../middleware/authController");
const router = express.Router();


//admin routes
router
    .route("/")
        .post(resolver, rolePermission ,  userAttendanceController.singleCheck)
        .put(resolver,  rolePermission ,  userAttendanceController.CheckOut)
        .get(resolver,  rolePermission ,  userAttendanceController.checkUser)
        // .delete(resolver,  userAttendanceController.deleteTax)

router
    .route("/bulk")
        .post(resolver,  rolePermission ,  userAttendanceController.bulkUpload)
        .get(resolver,  rolePermission ,  userAttendanceController.reportAttendance)

router
    .route("/download").get(resolver,   userAttendanceController.downloadExcelData)


module.exports = router;