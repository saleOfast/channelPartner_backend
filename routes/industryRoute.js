//importing modules
const express = require("express");
const industryController = require("../controllers/industryController");
const {resolver} = require("../connectionResolver/resolver");
const { rolePermission ,} = require("../middleware/authController")
const router = express.Router();


//admin routes
router
    .route("/")
        .post(resolver,  rolePermission, industryController.storeIndustry)
        .put(resolver,  rolePermission , industryController.editIndustry)
        .get(resolver,  rolePermission , industryController.getIndustry)
        .delete(resolver,   rolePermission ,industryController.deleteIndustry)

module.exports = router;