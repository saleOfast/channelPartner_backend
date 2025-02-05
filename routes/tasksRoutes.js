//importing modules
const express = require("express");
const taskController = require("../controllers/taskController");
const {resolver} = require("../connectionResolver/resolver");
const { rolePermission} = require("../middleware/authController");
const router = express.Router();
const {userValidationRules, validate ,superValidate } = require('../validator/validation');


//admin routes
router
    .route("/")
        .post(resolver,  rolePermission , userValidationRules('addTask'), validate, taskController.storeTask)
        .put(resolver,  rolePermission, userValidationRules('editTask'), validate,  taskController.editTask)
        .get(resolver,  rolePermission ,taskController.getTask)
        .delete(resolver,  rolePermission , userValidationRules('deleteTask'), validate,  taskController.deleteTask)

router
    .route("/download")
            .get(resolver, rolePermission,  taskController.downloadExcelData)

module.exports = router;