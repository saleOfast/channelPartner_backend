//importing modules
const express = require("express");
const taskSubControlles = require("../controllers/taskSubControlles");
const {resolver} = require("../connectionResolver/resolver");
const { rolePermission,} = require("../middleware/authController");
const router = express.Router();


//admin routes
router
    .route("/status")
        .post(resolver,  rolePermission,  taskSubControlles.storeTaskStatus)
        .put(resolver,  rolePermission, taskSubControlles.editTaskStatus)
        .get(resolver,  rolePermission, taskSubControlles.getTaskStatus)
        .delete(resolver,  rolePermission, taskSubControlles.deleteTaskStatus)

router
    .route("/status/bulk")
        .post(resolver,  rolePermission,  taskSubControlles.storeBulkTaskStatus)

router
    .route("/priority")
        .post(resolver,  rolePermission, taskSubControlles.storeTaskProirity)
        .put(resolver,  rolePermission, taskSubControlles.editTaskProirity)
        .get(resolver,  rolePermission, taskSubControlles.getTaskProirity)
        .delete(resolver,  rolePermission, taskSubControlles.deleteTaskProirity)

router
    .route("/priority/bulk")
        .post(resolver,  rolePermission, taskSubControlles.storeBulkTaskPriority)

module.exports = router;