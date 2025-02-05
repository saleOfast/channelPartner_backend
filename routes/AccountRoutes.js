//importing modules
const express = require("express");
const accountSubController = require("../controllers/accountSubController");
const AccountController = require("../controllers/AccountController");
const {resolver} = require("../connectionResolver/resolver");
const {protect , rolePermission} = require("../middleware/authController")
const {userValidationRules, validate } = require('../validator/validation');
const router = express.Router();



//admin routes
router
    .route("/")
        .post(resolver,   rolePermission, userValidationRules('addAccount'), validate, AccountController.storeAccount)
        .put(resolver,   rolePermission,  userValidationRules('editAccount'), validate,AccountController.editAccount)
        .get(resolver,   rolePermission, AccountController.getAccount)
        .delete(resolver,   rolePermission, userValidationRules('deleteAccount'), validate, AccountController.deleteAccount)

router
    .route("/tree")
        .get(resolver,  AccountController.getTreeAccount)   

router
    .route("/type")
        .post(resolver,   rolePermission, accountSubController.storeAccountType)
        .put(resolver,   rolePermission, accountSubController.editAccountType)
        .get(resolver,  rolePermission, accountSubController.getAccountType)
        .delete(resolver,   rolePermission, accountSubController.deleteAccountType)

router
    .route("/download")
            .get(resolver, rolePermission, AccountController.downloadExcelData)

router
    .route("/field")
            .post(resolver,  AccountController.storeaccountField)
            .get(resolver, AccountController.getaccountField)

module.exports = router;