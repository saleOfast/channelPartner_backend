//importing modules
const express = require("express");
const divisionController = require("../controllers/divisionController");
const {resolver} = require("../connectionResolver/resolver");
const {protect , rolePermission ,} = require("../middleware/authController")
const router = express.Router();


//admin routes
router
    .route("/")
        .post(resolver,  rolePermission , divisionController.storeDivision)
        .put(resolver,  rolePermission , divisionController.editDivison)
        .get(resolver , rolePermission , divisionController.getDivisons)
        .delete(resolver,  rolePermission , divisionController.deleteDivison)

router
    .route("/bulk")
        .post(resolver,  rolePermission , divisionController.storeBulkDivision)

module.exports = router;