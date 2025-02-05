//importing modules
const express = require("express");
const policyHeadController = require("../controllers/policyHeadController");
const {resolver} = require("../connectionResolver/resolver");
const { rolePermission ,} = require("../middleware/authController")
const router = express.Router();


//admin routes
router
    .route("/")
        .post(resolver,  rolePermission  , policyHeadController.storePolicyHead)
        .put(resolver,  rolePermission  , policyHeadController.editpolicyHead)
        .get(resolver,  rolePermission , policyHeadController.getPolicyHead)
        .delete(resolver,  rolePermission  , policyHeadController.deletepolicyHead)


router
    .route("/type")
        .post(resolver,  rolePermission  , policyHeadController.storePolicyType)
        .put(resolver,  rolePermission   , policyHeadController.editPolicyType)
        .get(resolver,  rolePermission , policyHeadController.getAllPolicyTypeIDWise)
        .delete(resolver,  rolePermission  , policyHeadController.deletePolicyType)

router
    .route("/type/user")
        .get(resolver,  policyHeadController.getPolicyTypeForUser)
router
    .route("/one")
        .get(resolver,  policyHeadController.getPolicyForUser)

module.exports = router