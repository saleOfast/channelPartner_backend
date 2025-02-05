"use strict";

//importing modules
var express = require("express");

var userController = require("../controllers/userController");

var _require = require("../connectionResolver/resolver"),
    resolver = _require.resolver;

var _require2 = require("../middleware/authController"),
    rolePermission = _require2.rolePermission;

var router = express.Router();

var _require3 = require("../validator/validation"),
    userValidationRules = _require3.userValidationRules,
    validate = _require3.validate,
    superValidate = _require3.superValidate; //admin routes


router.route("/").post(resolver, rolePermission, userValidationRules("registerUser"), validate, userController.createUser).get(resolver, rolePermission, userController.getAllUsers).put(resolver, rolePermission, userValidationRules("editUser"), validate, userController.updateUser)["delete"](resolver, rolePermission, userValidationRules("deleteUser"), validate, userController.deleteUser);
router.route("/uploads").post(resolver, userController.uploadsUserImages);
router.route("/owner").get(resolver, userController.getOwnerList).post(resolver, userController.registerBulkUser).put(resolver, rolePermission, userValidationRules("editInDbClientUser"), validate, userController.updateUser);
router.route("/forget").post(userController.forgotpassword).put(userController.resetPassword);
router.route("/count").post(resolver, userController.totalUser); //====================================================== Channel Partner Routes ===================================================

router.route("/cp/completeRegistration").put(userValidationRules("registerCP"), validate, userController.cpCompleteRegistration);
router.route("/cp/registrationToken/verification").post(userValidationRules("registerCPTokenVerify"), validate, userController.registrationTokenVerification);
module.exports = router;