//importing modules
const express = require("express");
const departmentController = require("../controllers/departmentController");
const {resolver} = require("../connectionResolver/resolver");
const {protect , rolePermission} = require("../middleware/authController");
const router = express.Router();


//admin routes
router
    .route("/")
        .post(resolver,  rolePermission, departmentController.storeDepartment)
        .put(resolver,  rolePermission, departmentController.editDepartment)
        .get(resolver,  rolePermission, departmentController.getDepartment)
        .delete(resolver,  rolePermission, departmentController.deleteDepartment)
router
    .route("/bulk")
        .post(resolver,  rolePermission , departmentController.storeBulkDepartment)
module.exports = router;