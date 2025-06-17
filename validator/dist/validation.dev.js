"use strict";

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var _require = require("express-validator"),
    body = _require.body,
    check = _require.check,
    validationResult = _require.validationResult,
    query = _require.query;

var userValidationRules = function userValidationRules(params) {
  switch (params) {
    case "login":
      return [check("email", "please enter email").notEmpty(), check("password", "please enter password").notEmpty()];

    case "registerUser":
      return [check("user").notEmpty().withMessage("please enter user name"), check("email").notEmpty().withMessage("please enter email").isEmail().withMessage("please enter a valid email"), check("role_id").notEmpty().withMessage("please choose user role").isNumeric().withMessage("please enter a valid role "), check("report_to").notEmpty().withMessage("please choose one user to report").isNumeric().withMessage("please enter a valid user to report")];

    case "editUser":
      return [check("user_id").optional().notEmpty().withMessage("please send user id").isNumeric().withMessage("please send a valid user id"), check("user_code").notEmpty().withMessage("please send user code"), check("user").optional().notEmpty().withMessage("please enter user name"), check("email").optional().notEmpty().withMessage("please enter email").isEmail().withMessage("please enter a valid email"), check("report_to").optional().notEmpty().withMessage("please choose one user to report").isNumeric().withMessage("please enter a valid user to report")];

    case "editInDbClientUser":
      return [check("user_id").optional().notEmpty().withMessage("please send user id").isNumeric().withMessage("please send a valid user id"), check("user_code").notEmpty().withMessage("please send user code"), check("user").optional().notEmpty().withMessage("please enter user name"), check("email").optional().notEmpty().withMessage("please enter email").isEmail().withMessage("please enter a valid email"), check("password").optional().isLength({
        min: 5
      }).withMessage("password length should be of minimum 5")];

    case "deleteUser":
      return [query("id").notEmpty().withMessage("please send user id")];

    case "registerClientUser":
      return [check("user").notEmpty().withMessage("please enter user name"), check("email").notEmpty().withMessage("please enter email").isEmail().withMessage("please enter a valid email"), check("contact_number").notEmpty().withMessage("please enetr contact no").isNumeric().withMessage("please enter a valid contact no"), check("subscription_start_date").notEmpty().withMessage("please choose subscription start date"), check("subscription_end_date").notEmpty().withMessage("please choose subscription end date"), check("no_of_months").notEmpty().withMessage("please choose no of months").isNumeric().withMessage("please chose a valid no of months"), check("no_of_license").notEmpty().withMessage("please enter license").isNumeric().withMessage("please enter a valid license no"), check("country_id").notEmpty().withMessage("please choose country").isNumeric().withMessage("please enter a valid country id"), check("state_id").notEmpty().withMessage("please choose state").isNumeric().withMessage("please enter a valid state id"), check("city_id").notEmpty().withMessage("please choose city").isNumeric().withMessage("please enter a valid city")];

    case "editClientUser":
      return [check("user_id").optional().notEmpty().withMessage("please send user id").isNumeric().withMessage("please send a valid user id"), check("user_code").notEmpty().withMessage("please send user code"), check("user").optional().notEmpty().withMessage("please enter user name"), check("email").optional().notEmpty().withMessage("please enter email").isEmail().withMessage("please enter a valid email"), check("contact_number").optional().notEmpty().withMessage("please enetr contact no").isNumeric().withMessage("please enter a valid contact no"), check("subscription_start_date").optional().notEmpty().withMessage("please choose subscription start date"), check("subscription_end_date").optional().notEmpty().withMessage("please choose subscription end date"), check("no_of_months").optional().notEmpty().withMessage("please choose no of months").isNumeric().withMessage("please chose a valid no of months"), check("no_of_license").optional().notEmpty().withMessage("please enter license").isNumeric().withMessage("please enter a valid license no")];

    case "addTask":
      return [check("task_name").notEmpty().withMessage("please enter task name"), check("task_status_id").optional().notEmpty().withMessage("please choose task status").isNumeric().withMessage("please enter a valid task status id"), check("task_priority_id").optional().notEmpty().withMessage("please choose task priority").isNumeric().withMessage("please enter a valid task priority id"), check("link_with_opportunity").optional().notEmpty().withMessage("please choose opportunity").isNumeric().withMessage("please enter a valid opportunity id"), check("assigned_to").notEmpty().withMessage("please choose a user to assign task").isNumeric().withMessage("please enter a valid user id"), check("due_date").notEmpty().withMessage("please choose due date"), check("lead_id").optional().notEmpty().withMessage("please choose lead").isNumeric().withMessage("please enter a valid lead id")];

    case "editTask":
      return [check("task_name").notEmpty().withMessage("please enter task name"), check("task_id").notEmpty().withMessage("please send task id").isNumeric().withMessage("please send a valid task id"), check("task_status_id").optional().notEmpty().withMessage("please choose task status").isNumeric().withMessage("please enter a valid task status id"), check("task_priority_id").optional().notEmpty().withMessage("please choose task priority").isNumeric().withMessage("please enter a valid task priority id"), check("link_with_opportunity").optional().notEmpty().withMessage("please choose opportunity").isNumeric().withMessage("please enter a valid opportunity id"), check("assigned_to").notEmpty().withMessage("please choose a user to assign task").isNumeric().withMessage("please enter a valid user id"), check("due_date").notEmpty().withMessage("please choose due date"), check("lead_id").optional().notEmpty().withMessage("please choose lead").isNumeric().withMessage("please enter a valid lead id")];

    case "deleteTask":
      return [query("t_id").notEmpty().withMessage("please send task id").isNumeric().withMessage("please send a valid task id")];

    case "addEvent":
      return [check("lead_id").optional().notEmpty().withMessage("please choose lead").isNumeric().withMessage("please enter a valid lead id"), check("link_with_opportunity").optional().notEmpty().withMessage("please choose opportunity").isNumeric().withMessage("please enter a valid opportunity id"), check("call_subject").notEmpty().withMessage("please enter task name"), check("event_date").notEmpty().withMessage("please choose date")];

    case "editEvent":
      return [check("call_lead_id").notEmpty().withMessage("please send call event id").isNumeric().withMessage("please send valid event id"), check("lead_id").optional().notEmpty().withMessage("please choose lead").isNumeric().withMessage("please enter a valid lead id"), check("link_with_opportunity").optional().notEmpty().withMessage("please choose opportunity").isNumeric().withMessage("please enter a valid opportunity id"), check("call_subject").notEmpty().withMessage("please enter task name"), check("event_date").notEmpty().withMessage("please choose date")];

    case "deleteEvent":
      return [query("event_id").notEmpty().withMessage("please send event id").isNumeric().withMessage("please send a valid event id")];

    case "addAccount":
      return [check("acc_name").notEmpty().withMessage("please enter account name"), check("contact_no").optional().notEmpty().withMessage("please enter contact no"), check("ind_id").optional().notEmpty().withMessage("please choose industry type").isNumeric().withMessage("please enter a valid industry type id"), check("account_type_id").optional().notEmpty().withMessage("please choose account type").isNumeric().withMessage("please enter a valid account type id"), check("bill_cont").optional().notEmpty().withMessage("please choose billing country").isNumeric().withMessage("please enter a billing country id"), check("bill_state").optional().notEmpty().withMessage("please choose billing state").isNumeric().withMessage("please enter a valid state country id"), check("bill_city").optional().notEmpty().withMessage("please choose billing city").isNumeric().withMessage("please enter a valid billing city id"), check("bill_pincode").optional().notEmpty().withMessage("please choose billing pincode").isNumeric().withMessage("please enter a valid billing pincode"), check("ship_cont").optional().notEmpty().withMessage("please choose shipping country").isNumeric().withMessage("please enter a valid shipping country id"), check("ship_state").optional().notEmpty().withMessage("please choose shipping state").isNumeric().withMessage("please enter a valid shipping state id"), check("ship_city").optional().notEmpty().withMessage("please choose shipping city").isNumeric().withMessage("please enter a valid shipping city"), check("ship_pincode").optional().notEmpty().withMessage("please choose shipping pincode").isNumeric().withMessage("please enter a valid shipping pincode")];

    case "editAccount":
      return [check("acc_id").notEmpty().withMessage("please choose account id").isNumeric().withMessage("please send a valid account id"), check("acc_name").notEmpty().withMessage("please enter account name"), check("contact_no").notEmpty().withMessage("please enter contact no"), check("ind_id").notEmpty().withMessage("please choose industry type").isNumeric().withMessage("please enter a valid industry type id"), check("account_type_id").notEmpty().withMessage("please choose account type").isNumeric().withMessage("please enter a valid account type id"), check("bill_cont").notEmpty().withMessage("please choose billing country").isNumeric().withMessage("please enter a billing country id"), check("bill_state").notEmpty().withMessage("please choose billing state").isNumeric().withMessage("please enter a valid state country id"), check("bill_city").notEmpty().withMessage("please choose billing city").isNumeric().withMessage("please enter a valid billing city id"), check("bill_pincode").notEmpty().withMessage("please choose billing pincode").isNumeric().withMessage("please enter a valid billing pincode"), check("ship_cont").notEmpty().withMessage("please choose shipping country").isNumeric().withMessage("please enter a valid shipping country id"), check("ship_state").notEmpty().withMessage("please choose shipping state").isNumeric().withMessage("please enter a valid shipping state id"), check("ship_city").notEmpty().withMessage("please choose shipping city").isNumeric().withMessage("please enter a valid shipping city"), check("ship_pincode").notEmpty().withMessage("please choose shipping pincode").isNumeric().withMessage("please enter a valid shipping pincode")];

    case "deleteAccount":
      return [query("acc_id").notEmpty().withMessage("please send account id").isNumeric().withMessage("please send a valid account id")];

    case "addContact":
      return [check("first_name").notEmpty().withMessage("please enter contact name"), check("last_name").optional().notEmpty().withMessage("please enter contact name"), check("account_name").optional().notEmpty().withMessage("please choose account owner").isNumeric().withMessage("please enter a valid account owner")];

    case "editContact":
      return [check("contact_id").notEmpty().withMessage("please send contact id").isNumeric().withMessage("please send a valid contact id"), check("first_name").notEmpty().withMessage("please enter contact name"), check("last_name").notEmpty().withMessage("please enter contact name"), check("account_name").notEmpty().withMessage("please choose account owner").isNumeric().withMessage("please enter a valid account owner")];

    case "deleteContact":
      return [query("c_id").notEmpty().withMessage("please send contact id").isNumeric().withMessage("please send a valid contact id")];

    case "addLead":
      return [check("lead_name").notEmpty().withMessage("please enter lead name"), check("lead_status_id").notEmpty().withMessage("please choose lead status").isNumeric().withMessage("please enter a valid  lead status id"), check("company_name").notEmpty().withMessage("please enter organisation name"), check("lead_owner").notEmpty().withMessage("please choose lead owner").isNumeric().withMessage("please enter a valid lead owner")];

    case "editLead":
      return [check("lead_id").notEmpty().withMessage("please send lead id").isNumeric().withMessage("please send a valid lead id"), check("lead_name").notEmpty().withMessage("please enter lead name"), check("company_name").notEmpty().withMessage("please enter organisation name"), check("lead_status_id").notEmpty().withMessage("please choose lead status").isNumeric().withMessage("please enter a valid  lead status id"), check("lead_owner").notEmpty().withMessage("please choose lead owner").isNumeric().withMessage("please enter a valid lead owner")];

    case "deleteLead":
      return [query("l_id").notEmpty().withMessage("please send lead id").isNumeric().withMessage("please send a valid lead id")];

    case "addProduct":
      return [check("p_code").notEmpty().withMessage("please enter product code"), check("brand_id").notEmpty().withMessage("please enter brand"), check("p_name").notEmpty().withMessage("please enter product name"), check("unit_in_case").notEmpty().withMessage("please enter unit of case"), check("p_price").notEmpty().withMessage("please choose product price").isNumeric().withMessage("please enter a valid product price"), check("p_cat_id").notEmpty().withMessage("please choose product category").isNumeric().withMessage("please enter a valid product category id")];

    case "editProduct":
      return [check("p_id").notEmpty().withMessage("please send product id ").isNumeric().withMessage("please send a valid product id"), check("brand_id").notEmpty().withMessage("please enter brand"), check("p_code").notEmpty().withMessage("please enter product code"), check("p_name").notEmpty().withMessage("please enter product name"), check("p_price").notEmpty().withMessage("please choose product price").isNumeric().withMessage("please enter a valid product price"), check("p_cat_id").notEmpty().withMessage("please choose product category").isNumeric().withMessage("please enter a valid product category id")];

    case "deleteProduct":
      return [query("p_id").notEmpty().withMessage("please send product id").isNumeric().withMessage("please send a valid product id")];

    case "addOpp":
      return [check("opp_name").notEmpty().withMessage("please enter opportunity name"), check("account_name").optional().notEmpty().withMessage("please choose account name").isNumeric().withMessage("please enter a valid account name"), check("close_date").optional().notEmpty().withMessage("please choose close date"), check("opportunity_stg_id").optional().notEmpty().withMessage("please choose opportunity stage").isNumeric().withMessage("please enter a valid opportunity stage"), check("opportunity_type_id").optional().notEmpty().withMessage("please choose opportunity type").isNumeric().withMessage("please enter a valid lead opportunity type"), check("lead_src_id").optional().notEmpty().withMessage("please choose lead source").isNumeric().withMessage("please enter a valid lead source"), check("amount").optional().notEmpty().withMessage("please enter amount").isNumeric().withMessage("please enter a valid amount")];

    case "editOpp":
      return [check("opp_name").notEmpty().withMessage("please enter opportunity name"), check("opp_id").notEmpty().withMessage("please send opportunity id").isNumeric().withMessage("please send a valid opportunity id"), check("account_name").notEmpty().withMessage("please choose account name").isNumeric().withMessage("please enter a valid account name"), check("close_date").notEmpty().withMessage("please choose close date"), check("opportunity_stg_id").notEmpty().withMessage("please choose opportunity stage").isNumeric().withMessage("please enter a valid opportunity stage"), check("opportunity_type_id").notEmpty().withMessage("please choose opportunity type").isNumeric().withMessage("please enter a valid lead opportunity type"), check("lead_src_id").notEmpty().withMessage("please choose lead source").isNumeric().withMessage("please enter a valid lead source"), check("amount").notEmpty().withMessage("please enter amount").isNumeric().withMessage("please enter a valid amount")];

    case "deleteOpp":
      return [query("o_id").notEmpty().withMessage("please send opportunity id").isNumeric().withMessage("please send a valid opportunity id")];

    case "addQuatation":
      return [check("contact_no").notEmpty().withMessage("please enter contact no").isNumeric().withMessage("please enter a valid contact no"), check("email").notEmpty().withMessage("please enter email").isEmail().withMessage("please enter a valid email"), check("opp_id").notEmpty().withMessage("please choose opportunity id").isNumeric().withMessage("please choose a valid opportunity id"), check("assigned_to").optional().notEmpty().withMessage("please choose user to assign").isNumeric().withMessage("please choose a valid user to assign"), check("quat_status").notEmpty().withMessage("please choose quotation status").isNumeric().withMessage("please choose a valid quotation status"), check("valid_till").notEmpty().withMessage("please pick date"), check("quat_summery").notEmpty().withMessage("please enter quatation summery"), check("bill_cont").notEmpty().withMessage("please choose billing country").isNumeric().withMessage("please enter a billing country id"), check("bill_state").notEmpty().withMessage("please choose billing state").isNumeric().withMessage("please enter a valid state country id"), check("bill_city").notEmpty().withMessage("please choose billing city").isNumeric().withMessage("please enter a valid billing city id"), check("bill_pincode").notEmpty().withMessage("please choose billing pincode").isNumeric().withMessage("please enter a valid billing pincode"), check("ship_cont").notEmpty().withMessage("please choose shipping country").isNumeric().withMessage("please enter a valid shipping country id"), check("ship_state").notEmpty().withMessage("please choose shipping state").isNumeric().withMessage("please enter a valid shipping state id"), check("ship_city").notEmpty().withMessage("please choose shipping city").isNumeric().withMessage("please enter a valid shipping city"), check("ship_pincode").notEmpty().withMessage("please choose shipping pincode").isNumeric().withMessage("please enter a valid shipping pincode"), check("ship_pincode").notEmpty().withMessage("please choose shipping pincode").isNumeric().withMessage("please enter a valid shipping pincode"), check("grand_total").notEmpty().withMessage("please choose Product for Quotation")];

    case "editQuotation":
      return [check("quat_mast_id").notEmpty().withMessage("please send quotation id").isNumeric().withMessage("please send a valid quotation id"), check("contact_no").notEmpty().withMessage("please enter contact no").isNumeric().withMessage("please enter a valid contact no"), check("email").notEmpty().withMessage("please enter email").isEmail().withMessage("please enter a valid email"), check("opp_id").notEmpty().withMessage("please choose opportunity id").isNumeric().withMessage("please choose a valid opportunity id"), check("assigned_to").optional().notEmpty().withMessage("please choose user to assign").isNumeric().withMessage("please choose a valid user to assign"), check("quat_status").notEmpty().withMessage("please choose quotation status").isNumeric().withMessage("please choose a valid quotation status"), check("valid_till").notEmpty().withMessage("please pick date"), check("quat_summery").notEmpty().withMessage("please enter quatation summery"), check("bill_cont").notEmpty().withMessage("please choose billing country").isNumeric().withMessage("please enter a billing country id"), check("bill_state").notEmpty().withMessage("please choose billing state").isNumeric().withMessage("please enter a valid state country id"), check("bill_city").notEmpty().withMessage("please choose billing city").isNumeric().withMessage("please enter a valid billing city id"), check("bill_pincode").notEmpty().withMessage("please choose billing pincode").isNumeric().withMessage("please enter a valid billing pincode"), check("ship_cont").notEmpty().withMessage("please choose shipping country").isNumeric().withMessage("please enter a valid shipping country id"), check("ship_state").notEmpty().withMessage("please choose shipping state").isNumeric().withMessage("please enter a valid shipping state id"), check("ship_city").notEmpty().withMessage("please choose shipping city").isNumeric().withMessage("please enter a valid shipping city"), check("ship_pincode").notEmpty().withMessage("please choose shipping pincode").isNumeric().withMessage("please enter a valid shipping pincode"), check("ship_pincode").notEmpty().withMessage("please choose shipping pincode").isNumeric().withMessage("please enter a valid shipping pincode"), check("grand_total").notEmpty().withMessage("please choose Product for Quotation")];

    case "editAdminProfile":
      return [check("user_id").notEmpty().withMessage("please send user id").isNumeric().withMessage("please send a valid user id"), check("email").notEmpty().withMessage("please enter email").isEmail().withMessage("please enter a valid email"), check("password").optional().isLength({
        min: 5
      }).withMessage("password length should be of minimum 5"), check("user").notEmpty().withMessage("user name cannot be empty"), check("contact_number").notEmpty().withMessage("please enter contact no").isNumeric().withMessage("please enter a valid contact number")];

    case "editAdminProfileIMG":
      return [check("user_id").notEmpty().withMessage("please send user id").isNumeric().withMessage("please send a valid user id")];

    case "addUserLeaveApp":
      return [check("head_leave_cnt_id").notEmpty().withMessage("please choose leave type").isNumeric().withMessage("please choose valid leave type"), check("reason").notEmpty().withMessage("please enter reason"), check("from_date").notEmpty().withMessage("please pick from date"), check("to_date").notEmpty().withMessage("please pick to date")];

    case "editUserLeaveApp":
      return [check("leave_app_id").notEmpty().withMessage("please send user id").isNumeric().withMessage("please send a valid user id"), check("head_leave_cnt_id").notEmpty().withMessage("please choose leave type").isNumeric().withMessage("please choose valid leave type"), check("leave_app_status").notEmpty().withMessage("please give leave status"), check("remarks").notEmpty().withMessage("please give remarks to the user")];

    case "deleteUserLeaveApp":
      return [query("la_id").notEmpty().withMessage("please send leave app id").isNumeric().withMessage("please send a valid leave app id")];

    case "addUserExpence":
      return [check("from_date").notEmpty().withMessage("please pick from date"), check("policy_id").notEmpty().withMessage("please choose policy").isNumeric().withMessage("no valid policy selected"), check("policy_type_id").optional().notEmpty().withMessage("please choose policy").isNumeric().withMessage("no valid policy selected"), check("from_location").notEmpty().withMessage("please enter from location"), check("to_location").optional().notEmpty().withMessage("please enter to location"), check("kms").optional().optional().notEmpty().withMessage("please enter kilometers"), check("total_expence").notEmpty().withMessage("total expence is empty")];

    case "editUserExpence":
      return [check("expence_id").notEmpty().withMessage("please send expense id").isNumeric().withMessage("please send valid expense id"), check("status").notEmpty().withMessage("please give leave status"), check("remark").notEmpty().withMessage("please give remarks to the user")];

    case "deleteUserExpence":
      return [query("expn_id").notEmpty().withMessage("please send leave app id").isNumeric().withMessage("please send a valid leave app id")];

    case "martBrandMaster":
      return [check("user_id").notEmpty().withMessage("please send user id").isNumeric().withMessage("please send a valid user id"), check("name").notEmpty().withMessage("name not provided")];

    case "mart_quiz":
      return [check("questions").notEmpty().withMessage("please enter question"), check("option1").notEmpty().withMessage("please enter option1"), check("option2").notEmpty().withMessage("please enter option2"), check("option3").notEmpty().withMessage("please enter option3"), check("option4").notEmpty().withMessage("please enter optopn4"), check("answer").notEmpty().withMessage("please enter answer"), check("marks").notEmpty().withMessage("please enter marks")];

    case "martStoreCategory":
      return [check("user_id").notEmpty().withMessage("please send user id").isNumeric().withMessage("please send a valid user id"), check("category_name").notEmpty().withMessage("category name not provided")];

    case "martScheme":
      return [check("user_id").notEmpty().withMessage("please send user id").isNumeric().withMessage("please send a valid user id"), check("name").notEmpty().withMessage("name not provided"), check("month").notEmpty().withMessage("please enter month").isNumeric().withMessage("please send a valid month"), check("year").notEmpty().withMessage("please enter year").isNumeric().withMessage("please send a valid year"), check("file").notEmpty().withMessage("file not provided")];

    case "brandCreate":
      return [body("brand_name").notEmpty().withMessage("Brand name is required")];

    case "brandUpdate":
      return [body("brand_name").notEmpty().withMessage("Brand name is required")];

    case "registerCP":
      return [check("name").notEmpty().withMessage("please enter user name"), check("mobile").notEmpty().withMessage("please enter user mobile"), // check("aadhar").notEmpty().withMessage("please upload aadhar card"),
      // check("pan").notEmpty().withMessage("please upload pan card"),
      // check("rera").notEmpty().withMessage("please upload rera document"),
      check("token").notEmpty().withMessage("please provide valid token"), check("id").notEmpty().withMessage("please enter id")];

    case "registerCPTokenVerify":
      return [check("token").notEmpty().withMessage("please provide valid token")];

    default:
      return [];
  } // username must be an email

};

var validate = function validate(req, res, next) {
  var errors, extractedErrors;
  return regeneratorRuntime.async(function validate$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          errors = validationResult(req);

          if (!errors.isEmpty()) {
            _context.next = 3;
            break;
          }

          return _context.abrupt("return", next());

        case 3:
          extractedErrors = [];
          errors.array().map(function (err) {
            return extractedErrors.push(_defineProperty({}, err.param, err.msg));
          }); // await req.config.sequelize.close();

          return _context.abrupt("return", res.status(400).json({
            status: 422,
            message: "please fill the mandatory fields",
            data: extractedErrors
          }));

        case 6:
        case "end":
          return _context.stop();
      }
    }
  });
};

var superValidate = function superValidate(req, res, next) {
  var errors, extractedErrors;
  return regeneratorRuntime.async(function superValidate$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          errors = validationResult(req);

          if (!errors.isEmpty()) {
            _context2.next = 3;
            break;
          }

          return _context2.abrupt("return", next());

        case 3:
          extractedErrors = [];
          errors.array().map(function (err) {
            return extractedErrors.push(_defineProperty({}, err.param, err.msg));
          });
          return _context2.abrupt("return", res.status(400).json({
            status: 422,
            message: "please fill the mandatory fields",
            data: extractedErrors
          }));

        case 6:
        case "end":
          return _context2.stop();
      }
    }
  });
};

module.exports = {
  userValidationRules: userValidationRules,
  validate: validate,
  superValidate: superValidate
};