const { body, check, validationResult, query } = require("express-validator");
const dmsValidationRules = (params) => {
  switch (params) {
    case "banner_create":
      return [
        check("banner_alt", "please enter email").notEmpty(),
      ];

    case "banner_update":
      return [
        check("banner_id")
          .notEmpty()
          .withMessage("please send banner id")
          .isNumeric()
          .withMessage("please send a valid banner id"),
      ];

    
   

    default:
      return [];
  }
  // username must be an email
};




module.exports = {
    dmsValidationRules,
};
