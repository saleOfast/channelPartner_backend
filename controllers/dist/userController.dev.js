"use strict";

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var _require = require("sequelize"),
    Sequelize = _require.Sequelize,
    DataTypes = _require.DataTypes,
    QueryTypes = _require.QueryTypes,
    where = _require.where,
    Op = _require.Op;

var _require2 = require("../helper/responce"),
    responseError = _require2.responseError,
    responseSuccess = _require2.responseSuccess;

var bcrypt = require("bcryptjs");

var db = require("../model");

var crypto = require("crypto");

var fileUpload = require("../common/imageExport");

var _require3 = require("../connectionResolver/firstConnection"),
    first = _require3.first;

var sendEmail = require("../common/mailer");

var moment = require("moment");

var jwt = require("jsonwebtoken");

var _require4 = require("../config/constant"),
    BASE_URL = _require4.BASE_URL;

var path = require("path");

var fs = require("fs");

var _require5 = require("util"),
    promisify = _require5.promisify;

var randomCodeGenrator = function randomCodeGenrator(name) {
  var result = "";
  result = Math.floor(10000000 + Math.random() * 90000000);
  var code = name + result;
  return code;
};

var buildTree = function buildTree(auth, parentId, dashNavArr) {
  var children = AllData.filter(function (item) {
    return item.parent_id == parentId;
  });
  children.forEach(function (child) {
    if (auth && child.is_active == 1) {
      dashNavArr.push(child);
    } else {
      if (child.actions == 1) {
        dashNavArr.push(child);
      }
    }

    if (dashNavArr.length > 0) {
      return dashNavArr;
    } else {
      return dashNavArr.concat(buildTree(auth, child.menu_id, dashNavArr)); // Recursive call without assigning to a variable
    }
  });
  return dashNavArr;
};

exports.totalUser = function _callee(req, res) {
  var count, clientAdmin, countData;
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          _context.next = 3;
          return regeneratorRuntime.awrap(req.config.users.count({
            where: {
              isDB: false
            }
          }));

        case 3:
          count = _context.sent;
          _context.next = 6;
          return regeneratorRuntime.awrap(db.clients.findOne({
            where: {
              db_name: db_name,
              isDB: true
            }
          }));

        case 6:
          clientAdmin = _context.sent;
          countData = {
            userCount: count,
            no_of_license: clientAdmin.no_of_license
          };
          _context.next = 10;
          return regeneratorRuntime.awrap(responseSuccess(req, res, "user list count", countData));

        case 10:
          return _context.abrupt("return", _context.sent);

        case 13:
          _context.prev = 13;
          _context.t0 = _context["catch"](0);
          console.log(_context.t0);
          _context.next = 18;
          return regeneratorRuntime.awrap(responseError(req, res, "Something Went Wrong"));

        case 18:
          return _context.abrupt("return", _context.sent);

        case 19:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 13]]);
};

exports.createUser = function _callee2(req, res) {
  var _req$body, email, role_id, isCRM, isDMS, isSALES, isCHANNEL, clientAdmin, userCode, userPassword, data, userData, count, dbUserData, userProfileData, option, registrationToken, signupLink, htmlTemplatePath, htmlTemplate, htmlContent, resetToken, message, send;

  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
          _req$body = req.body, email = _req$body.email, role_id = _req$body.role_id, isCRM = _req$body.isCRM, isDMS = _req$body.isDMS, isSALES = _req$body.isSALES, isCHANNEL = _req$body.isCHANNEL;
          _context2.next = 4;
          return regeneratorRuntime.awrap(db.clients.findOne({
            where: {
              db_name: req.user.db_name,
              isDB: true
            }
          } //   { transaction: process }
          ));

        case 4:
          clientAdmin = _context2.sent;
          // if (clientAdmin.dataValues.domain != null) {
          //   if (clientAdmin.domain.split("@")[1] != email.split("@")[1]) {
          //     await process.cleanup();
          //     await DBprocess.cleanup();
          //     return res
          //       .status(400)
          //       .json({ status: 400, message: "domain does not match" });
          //   }
          // }
          userCode = randomCodeGenrator("USER");
          _context2.next = 8;
          return regeneratorRuntime.awrap(bcrypt.hash(userCode, 10));

        case 8:
          userPassword = _context2.sent;
          data = req.body;
          data.password = userPassword;
          data.isDB = false;
          data.user_code = userCode;
          _context2.next = 15;
          return regeneratorRuntime.awrap(db.clients.findOne({
            where: {
              db_name: req.user.db_name,
              email: email
            }
          } //   { transaction: process }
          ));

        case 15:
          userData = _context2.sent;

          if (!userData) {
            _context2.next = 22;
            break;
          }

          _context2.next = 19;
          return regeneratorRuntime.awrap(req.config.sequelize.close());

        case 19:
          return _context2.abrupt("return", res.status(400).json({
            status: 400,
            message: "user existed in this db"
          }));

        case 22:
          _context2.next = 24;
          return regeneratorRuntime.awrap(req.config.users.count({
            where: {
              isDB: false
            }
          }));

        case 24:
          count = _context2.sent;

          if (!(count >= clientAdmin.no_of_license)) {
            _context2.next = 29;
            break;
          }

          _context2.next = 28;
          return regeneratorRuntime.awrap(responseError(req, res, "cannot add more user, user count exceed the license count"));

        case 28:
          return _context2.abrupt("return", _context2.sent);

        case 29:
          data.subscription_start_date = clientAdmin.dataValues.subscription_start_date;
          data.subscription_end_date = clientAdmin.dataValues.subscription_end_date, data.no_of_months = clientAdmin.dataValues.no_of_months;
          data.domain = clientAdmin.dataValues.domain;
          data.no_of_license = clientAdmin.dataValues.no_of_license;
          data.db_name = req.user.db_name; // createing db users and common db users

          _context2.next = 36;
          return regeneratorRuntime.awrap(db.clients.create(data, {// transaction: DBprocess,
          }));

        case 36:
          userData = _context2.sent;
          _context2.next = 39;
          return regeneratorRuntime.awrap(req.config.users.create(data, {// transaction: process,
          }));

        case 39:
          dbUserData = _context2.sent;
          _context2.next = 42;
          return regeneratorRuntime.awrap(db.sequelize.query("Call proc_client_platform(:db_name, :client_id, :isCRM, :isDMS, :isSALES, :isCHANNEL, :type)", {
            replacements: {
              db_name: req.user.db_name,
              client_id: dbUserData.user_id,
              isCRM: isCRM ? isCRM : 0,
              isDMS: isDMS ? isDMS : 0,
              isSALES: isSALES ? isSALES : 0,
              isCHANNEL: isCHANNEL ? isCHANNEL : 0,
              type: "user"
            },
            type: QueryTypes.INSERT //   transaction: DBprocess,

          }));

        case 42:
          data.user_id = dbUserData.user_id;
          _context2.next = 45;
          return regeneratorRuntime.awrap(req.config.usersProfiles.create(data, {// transaction: process,
          }));

        case 45:
          userProfileData = _context2.sent;
          // sending email for the user
          option = {};

          if (role_id === 1) {
            registrationToken = jwt.sign({
              id: dbUserData.user_id,
              db_name: req.user.db_name
            }, process.env.SECRET_KEY, {
              expiresIn: process.env.CP_SIGNUP_EXPIRES
            });
            signupLink = "".concat(BASE_URL, "/ChannelPartnerRegister?token=").concat(registrationToken);
            htmlTemplatePath = path.join(__dirname, "..", "mail", "cp", "signup.html");
            htmlTemplate = fs.readFileSync(htmlTemplatePath, "utf-8");
            htmlContent = htmlTemplate.replace(/{{signupLink}}/g, signupLink);
            option = {
              email: email,
              subject: "Kloud Mart",
              message: htmlContent
            };
          } else {
            resetToken = crypto.randomBytes(32).toString("hex");
            data.password_reset_token = crypto.createHash("sha256").update(resetToken).digest("hex");
            message = "Welcome to the LeadShyne. We are glad that you become part of us .<br/> Click this link to reset your password : <a href=\"https://leadshyne.com/ChangePassword?tkn=u$34".concat(data.password_reset_token, "\" target=\"_blank\"><b> Click here </b></a>:");
            option = {
              email: email,
              subject: "LeadShyne",
              message: message
            };
          }

          _context2.next = 50;
          return regeneratorRuntime.awrap(sendEmail(option));

        case 50:
          //   await process.commit();
          //   await DBprocess.commit();
          send = {
            dbUserData: dbUserData,
            userProfileData: userProfileData
          };
          _context2.next = 53;
          return regeneratorRuntime.awrap(responseSuccess(req, res, "user created successfully", send));

        case 53:
          return _context2.abrupt("return", _context2.sent);

        case 54:
          _context2.next = 62;
          break;

        case 56:
          _context2.prev = 56;
          _context2.t0 = _context2["catch"](0);
          // await process.rollback();
          // await DBprocess.rollback();
          // await process.cleanup();
          // await DBprocess.cleanup();
          console.log(_context2.t0);
          _context2.next = 61;
          return regeneratorRuntime.awrap(responseError(req, res, "Something Went Wrong"));

        case 61:
          return _context2.abrupt("return", _context2.sent);

        case 62:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[0, 56]]);
};

exports.uploadsUserImages = function _callee3(req, res) {
  var _path, updateData, data, see;

  return regeneratorRuntime.async(function _callee3$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _context3.prev = 0;
          _path = req.body.path;
          updateData = req.body;
          _context3.next = 5;
          return regeneratorRuntime.awrap(fileUpload.imageExport(req, res, _path));

        case 5:
          data = _context3.sent;

          if (data.message) {
            _context3.next = 16;
            break;
          }

          if (_path === "adh") {
            updateData.aadhar_file = data;
          } else if (_path === "pan") {
            updateData.pan_file = data;
          } else if (_path === "dl") {
            updateData.dl_file = data;
          } else if (_path === "lsUser") {
            updateData.user_image_file = data;
          }

          _context3.next = 10;
          return regeneratorRuntime.awrap(req.config.usersProfiles.update(updateData, {
            where: {
              user_id: updateData.user_id
            }
          }));

        case 10:
          see = _context3.sent;
          _context3.next = 13;
          return regeneratorRuntime.awrap(responseSuccess(req, res, "document uploaded successfully", see));

        case 13:
          return _context3.abrupt("return", _context3.sent);

        case 16:
          _context3.next = 18;
          return regeneratorRuntime.awrap(responseError(req, res, "Something Went Wrong"));

        case 18:
          return _context3.abrupt("return", _context3.sent);

        case 19:
          _context3.next = 26;
          break;

        case 21:
          _context3.prev = 21;
          _context3.t0 = _context3["catch"](0);
          _context3.next = 25;
          return regeneratorRuntime.awrap(responseError(req, res, "Something Went Wrong"));

        case 25:
          return _context3.abrupt("return", _context3.sent);

        case 26:
        case "end":
          return _context3.stop();
      }
    }
  }, null, null, [[0, 21]]);
};

exports.getAllUserByRole = function _callee4(req, res) {
  var AlluserRoleWiseCount;
  return regeneratorRuntime.async(function _callee4$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          _context4.prev = 0;
          _context4.next = 3;
          return regeneratorRuntime.awrap(req.config.sequelize.query("SELECT db_users.role_id, db_roles.role_name,COUNT(*) as 'count' from db_roles INNER JOIN db_users ON db_users.role_id = db_roles.role_id WHERE db_users.deletedAt is null GROUP by db_users.role_id", {
            type: QueryTypes.SELECT
          }));

        case 3:
          AlluserRoleWiseCount = _context4.sent;
          _context4.next = 6;
          return regeneratorRuntime.awrap(responseSuccess(req, res, "Role wise count", AlluserRoleWiseCount));

        case 6:
          return _context4.abrupt("return", _context4.sent);

        case 9:
          _context4.prev = 9;
          _context4.t0 = _context4["catch"](0);
          _context4.next = 13;
          return regeneratorRuntime.awrap(responseError(req, res, "Something Went Wrong"));

        case 13:
          return _context4.abrupt("return", _context4.sent);

        case 14:
        case "end":
          return _context4.stop();
      }
    }
  }, null, null, [[0, 9]]);
};

exports.getUsersByRoleID = function _callee5(req, res) {
  var userData;
  return regeneratorRuntime.async(function _callee5$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          _context5.prev = 0;
          _context5.next = 3;
          return regeneratorRuntime.awrap(req.config.users.findAll({
            where: {
              role_id: req.query.role_id
            },
            include: [{
              model: req.config.usersProfiles,
              include: [{
                model: req.config.divisions
              }, {
                model: req.config.departments
              }, {
                model: req.config.designations
              }]
            }, {
              model: req.config.user_role
            }]
          }));

        case 3:
          userData = _context5.sent;
          _context5.next = 6;
          return regeneratorRuntime.awrap(responseSuccess(req, res, "Role wise count", userData));

        case 6:
          return _context5.abrupt("return", _context5.sent);

        case 9:
          _context5.prev = 9;
          _context5.t0 = _context5["catch"](0);
          _context5.next = 13;
          return regeneratorRuntime.awrap(responseError(req, res, "Something Went Wrong"));

        case 13:
          return _context5.abrupt("return", _context5.sent);

        case 14:
        case "end":
          return _context5.stop();
      }
    }
  }, null, null, [[0, 9]]);
};

exports.getAllUsers = function _callee6(req, res) {
  var userData, RolePermissionData, rootNodes, dashNavArr, tree, whereCaluse;
  return regeneratorRuntime.async(function _callee6$(_context6) {
    while (1) {
      switch (_context6.prev = _context6.next) {
        case 0:
          _context6.prev = 0;
          userData = []; // for specific user detail

          if (!req.query.id) {
            _context6.next = 16;
            break;
          }

          _context6.next = 5;
          return regeneratorRuntime.awrap(req.config.users.findOne({
            where: {
              user_code: req.query.id
            },
            attributes: {
              exclude: ["password", "password_reset_token", "password_reset_expires", "deletedAt"]
            },
            include: [{
              model: req.config.usersProfiles,
              include: [{
                model: req.config.divisions,
                attributes: {
                  exclude: ["createdAt", "updatedAt", "deletedAt"]
                }
              }, {
                model: req.config.departments,
                attributes: {
                  exclude: ["createdAt", "updatedAt", "deletedAt"]
                }
              }, {
                model: req.config.designations,
                attributes: {
                  exclude: ["createdAt", "updatedAt", "deletedAt"]
                }
              }]
            }, {
              model: req.config.user_role,
              attributes: {
                exclude: ["createdAt", "updatedAt", "deletedAt"]
              }
            }, {
              model: req.config.country,
              attributes: {
                exclude: ["createdAt", "updatedAt", "deletedAt"]
              }
            }, {
              model: req.config.states,
              attributes: {
                exclude: ["createdAt", "updatedAt", "deletedAt"]
              }
            }, {
              model: req.config.city,
              attributes: {
                exclude: ["createdAt", "updatedAt", "deletedAt"]
              }
            }]
          }));

        case 5:
          userData = _context6.sent;
          _context6.next = 8;
          return regeneratorRuntime.awrap(req.config.sequelize.query("SELECT m1.menu_id,\n               m1.menu_name,\n               m1.parent_id,\n               m1.menu_order,\n               m1.is_active,\n               m1.link,\n               r1.permission_id,\n               r1.role_id,\n               m1.is_task,\n               m1.icon_path,\n               IFNULL(r1.actions, 0) as \"actions\"\n           FROM\n               db_menus AS m1\n               LEFT JOIN db_role_permissions AS r1 ON m1.menu_id = r1.menu_id AND r1.role_id = ".concat(req.user.role_id, " where m1.is_active = true"), {
            type: QueryTypes.SELECT
          }));

        case 8:
          RolePermissionData = _context6.sent;
          AllData = RolePermissionData;
          rootNodes = AllData.filter(function (item) {
            return item.menu_id == 173;
          });
          dashNavArr = [];
          tree = rootNodes.map(function (rootNode) {
            if (req.user.isDB && rootNode.is_active == 1) {
              dashNavArr.push(rootNode);
            } else {
              if (rootNode.actions == 1) {
                dashNavArr.push(rootNode);
              }
            }

            if (dashNavArr.length > 0) {
              return dashNavArr;
            } else {
              dashNavArr.concat(buildTree(req.user.isDB, rootNode.menu_id, dashNavArr));
            }
          });
          dashNavArr.length > 0 ? userData.dataValues.hasMaster = true : userData.dataValues.hasMaster = false;
          _context6.next = 22;
          break;

        case 16:
          // if mode == ul and login by admin then all user will shown except the admin
          whereCaluse = {};

          if (req.query.mode && req.query.mode == "ul") {
            whereCaluse = {
              isDB: false
            };
          } // if not login in by admin the all user list will be shown that report to current user


          if (!req.user.isDB) {
            whereCaluse = _defineProperty({
              isDB: false
            }, Op.or, [{
              user_id: req.user.user_id
            }, {
              report_to: req.user.user_id
            }]);
          }

          _context6.next = 21;
          return regeneratorRuntime.awrap(req.config.users.findAll({
            where: whereCaluse,
            attributes: {
              exclude: ["password", "password_reset_token", "password_reset_expires", "deletedAt"]
            },
            include: [{
              model: req.config.usersProfiles,
              include: [{
                model: req.config.divisions,
                attributes: {
                  exclude: ["createdAt", "updatedAt", "deletedAt"]
                }
              }, {
                model: req.config.departments,
                attributes: {
                  exclude: ["createdAt", "updatedAt", "deletedAt"]
                }
              }, {
                model: req.config.designations,
                attributes: {
                  exclude: ["createdAt", "updatedAt", "deletedAt"]
                }
              }]
            }, {
              model: req.config.user_role,
              attributes: {
                exclude: ["createdAt", "updatedAt", "deletedAt"]
              }
            }, {
              model: req.config.country,
              attributes: {
                exclude: ["createdAt", "updatedAt", "deletedAt"]
              }
            }, {
              model: req.config.states,
              attributes: {
                exclude: ["createdAt", "updatedAt", "deletedAt"]
              }
            }, {
              model: req.config.city,
              attributes: {
                exclude: ["createdAt", "updatedAt", "deletedAt"]
              }
            }]
          }));

        case 21:
          userData = _context6.sent;

        case 22:
          _context6.next = 24;
          return regeneratorRuntime.awrap(responseSuccess(req, res, "All Users", userData));

        case 24:
          return _context6.abrupt("return", _context6.sent);

        case 27:
          _context6.prev = 27;
          _context6.t0 = _context6["catch"](0);
          console.error(_context6.t0);
          _context6.next = 32;
          return regeneratorRuntime.awrap(responseError(req, res, "Something Went Wrong"));

        case 32:
          return _context6.abrupt("return", _context6.sent);

        case 33:
        case "end":
          return _context6.stop();
      }
    }
  }, null, null, [[0, 27]]);
};

exports.updateUser = function _callee7(req, res) {
  var dbUserData, userData, userDataInDB;
  return regeneratorRuntime.async(function _callee7$(_context7) {
    while (1) {
      switch (_context7.prev = _context7.next) {
        case 0:
          _context7.prev = 0;
          dbUserData = req.body; // find user in admin

          _context7.next = 4;
          return regeneratorRuntime.awrap(db.clients.findOne({
            where: {
              user_code: dbUserData.user_code
            }
          }));

        case 4:
          userData = _context7.sent;
          console.log("userData", userData); // if user not found send error user not found

          if (userData) {
            _context7.next = 10;
            break;
          }

          _context7.next = 9;
          return regeneratorRuntime.awrap(req.config.sequelize.close());

        case 9:
          return _context7.abrupt("return", res.status(400).json({
            status: 400,
            message: "user not found"
          }));

        case 10:
          if (!dbUserData.password) {
            _context7.next = 14;
            break;
          }

          _context7.next = 13;
          return regeneratorRuntime.awrap(bcrypt.hash(dbUserData.password, 10));

        case 13:
          dbUserData.password = _context7.sent;

        case 14:
          _context7.next = 16;
          return regeneratorRuntime.awrap(req.config.users.update(dbUserData, {
            where: {
              user_code: dbUserData.user_code
            }
          }));

        case 16:
          _context7.next = 18;
          return regeneratorRuntime.awrap(req.config.users.findOne({
            where: {
              user_code: dbUserData.user_code
            }
          }));

        case 18:
          userDataInDB = _context7.sent;
          _context7.next = 21;
          return regeneratorRuntime.awrap(req.config.usersProfiles.update(dbUserData, {
            where: {
              user_id: userDataInDB.user_id
            }
          }));

        case 21:
          // change user id according to admin db  and then update admin db
          dbUserData.user_id = userData.user_id;
          _context7.next = 24;
          return regeneratorRuntime.awrap(db.clients.update(dbUserData, {
            where: {
              user_code: dbUserData.user_code
            }
          }));

        case 24:
          _context7.next = 26;
          return regeneratorRuntime.awrap(req.config.sequelize.close());

        case 26:
          return _context7.abrupt("return", res.status(200).json({
            status: 200,
            message: "user data updated"
          }));

        case 29:
          _context7.prev = 29;
          _context7.t0 = _context7["catch"](0);
          console.log(_context7.t0);
          _context7.next = 34;
          return regeneratorRuntime.awrap(req.config.sequelize.close());

        case 34:
          return _context7.abrupt("return", res.status(400).json({
            status: 400,
            message: "Something Went Wrong"
          }));

        case 35:
        case "end":
          return _context7.stop();
      }
    }
  }, null, null, [[0, 29]]);
};

exports.deleteUser = function _callee8(req, res) {
  var user_code, userData;
  return regeneratorRuntime.async(function _callee8$(_context8) {
    while (1) {
      switch (_context8.prev = _context8.next) {
        case 0:
          _context8.prev = 0;
          user_code = req.query.id;
          _context8.next = 4;
          return regeneratorRuntime.awrap(db.clients.findOne({
            where: {
              user_code: user_code
            }
          }));

        case 4:
          userData = _context8.sent;

          if (userData) {
            _context8.next = 9;
            break;
          }

          _context8.next = 8;
          return regeneratorRuntime.awrap(req.config.sequelize.close());

        case 8:
          return _context8.abrupt("return", res.status(400).json({
            status: 400,
            message: "user not found"
          }));

        case 9:
          _context8.next = 11;
          return regeneratorRuntime.awrap(db.clients.destroy({
            where: {
              user_code: user_code
            }
          }));

        case 11:
          _context8.next = 13;
          return regeneratorRuntime.awrap(req.config.users.destroy({
            where: {
              user_code: user_code
            }
          }));

        case 13:
          return _context8.abrupt("return", res.status(200).json({
            status: 200,
            message: "user deleted successfully",
            data: null
          }));

        case 16:
          _context8.prev = 16;
          _context8.t0 = _context8["catch"](0);
          console.log(_context8.t0);
          _context8.next = 21;
          return regeneratorRuntime.awrap(req.config.sequelize.close());

        case 21:
          return _context8.abrupt("return", res.status(400).json({
            status: 400,
            message: "Something Went Wrong"
          }));

        case 22:
        case "end":
          return _context8.stop();
      }
    }
  }, null, null, [[0, 16]]);
};

exports.getOwnerList = function _callee9(req, res) {
  var userData;
  return regeneratorRuntime.async(function _callee9$(_context9) {
    while (1) {
      switch (_context9.prev = _context9.next) {
        case 0:
          _context9.prev = 0;
          _context9.next = 3;
          return regeneratorRuntime.awrap(req.config.users.findAll({
            where: _defineProperty({
              isDB: false
            }, Op.or, [{
              user_id: req.user.user_id
            }, {
              report_to: req.user.user_id
            }]),
            attributes: {
              exclude: ["password", "password_reset_token", "password_reset_expires", "deletedAt"]
            }
          }));

        case 3:
          userData = _context9.sent;
          _context9.next = 6;
          return regeneratorRuntime.awrap(responseSuccess(req, res, "Owner list", userData));

        case 6:
          return _context9.abrupt("return", _context9.sent);

        case 9:
          _context9.prev = 9;
          _context9.t0 = _context9["catch"](0);
          console.log(_context9.t0);
          _context9.next = 14;
          return regeneratorRuntime.awrap(req.config.sequelize.close());

        case 14:
          return _context9.abrupt("return", res.status(400).json({
            status: 400,
            message: "Something Went Wrong",
            data: {
              error: _context9.t0
            }
          }));

        case 15:
        case "end":
          return _context9.stop();
      }
    }
  }, null, null, [[0, 9]]);
};

exports.forgotpassword = function _callee10(req, res) {
  var email, user, resetToken, passwordResetToken, message, option;
  return regeneratorRuntime.async(function _callee10$(_context10) {
    while (1) {
      switch (_context10.prev = _context10.next) {
        case 0:
          _context10.prev = 0;
          email = req.body.email;

          if (email) {
            _context10.next = 4;
            break;
          }

          return _context10.abrupt("return", res.status(400).json({
            status: 400,
            message: "Please provide email for forgot password",
            data: null
          }));

        case 4:
          _context10.next = 6;
          return regeneratorRuntime.awrap(db.clients.findOne({
            where: {
              email: email
            }
          }));

        case 6:
          user = _context10.sent;

          if (user) {
            _context10.next = 9;
            break;
          }

          return _context10.abrupt("return", res.status(404).json({
            status: false,
            message: "No user found with that email"
          }));

        case 9:
          resetToken = crypto.randomBytes(32).toString("hex");
          passwordResetToken = crypto.createHash("sha256").update(resetToken).digest("hex");
          _context10.next = 13;
          return regeneratorRuntime.awrap(user.update({
            password_reset_token: passwordResetToken,
            password_reset_expires: moment(new Date()).add(1, "d").toDate()
          }));

        case 13:
          _context10.next = 15;
          return regeneratorRuntime.awrap(user.save());

        case 15:
          message = "Click this link to reset your password : <a href=\"https://leadshyne.com/ChangePassword?tkn=u$34".concat(passwordResetToken, "\" target=\"_blank\"><b> Click here </b></a>");
          option = {
            email: email,
            subject: "Your passowrd reset token only 1 day ",
            message: message
          };
          _context10.next = 19;
          return regeneratorRuntime.awrap(sendEmail(option));

        case 19:
          return _context10.abrupt("return", res.status(200).json({
            status: 200,
            token: passwordResetToken,
            message: "Mail sent to your mail id ".concat(user.email)
          }));

        case 22:
          _context10.prev = 22;
          _context10.t0 = _context10["catch"](0);
          console.log(_context10.t0);
          return _context10.abrupt("return", res.status(400).json({
            status: 400,
            message: "Something Went Wrong",
            data: _context10.t0
          }));

        case 26:
        case "end":
          return _context10.stop();
      }
    }
  }, null, null, [[0, 22]]);
};

exports.resetPassword = function _callee11(req, res) {
  var body, user, newPassword, newSavePassword, userDB;
  return regeneratorRuntime.async(function _callee11$(_context11) {
    while (1) {
      switch (_context11.prev = _context11.next) {
        case 0:
          _context11.prev = 0;
          body = req.body;

          if (body.password) {
            _context11.next = 4;
            break;
          }

          return _context11.abrupt("return", res.status(400).json({
            status: 400,
            message: "Please enter password"
          }));

        case 4:
          _context11.next = 6;
          return regeneratorRuntime.awrap(db.clients.findOne({
            where: {
              password_reset_token: body.token
            }
          }));

        case 6:
          user = _context11.sent;

          if (user) {
            _context11.next = 9;
            break;
          }

          return _context11.abrupt("return", res.status(400).json({
            status: 400,
            message: "Unable to found user"
          }));

        case 9:
          newPassword = body.password;
          _context11.next = 12;
          return regeneratorRuntime.awrap(bcrypt.hash(newPassword, 10));

        case 12:
          newSavePassword = _context11.sent;
          user.update({
            password: newSavePassword,
            password_reset_token: null,
            password_reset_expires: new Date()
          });
          user.save();
          _context11.next = 17;
          return regeneratorRuntime.awrap(first(user.db_name));

        case 17:
          userDB = _context11.sent;
          _context11.next = 20;
          return regeneratorRuntime.awrap(userDB.users.update({
            password: newSavePassword
          }, {
            where: {
              user_code: user.user_code
            }
          }));

        case 20:
          userDB.sequelize.close();
          return _context11.abrupt("return", res.status(200).json({
            status: 200,
            message: "password changed",
            data: user
          }));

        case 24:
          _context11.prev = 24;
          _context11.t0 = _context11["catch"](0);
          console.log(_context11.t0);
          return _context11.abrupt("return", res.status(400).json({
            status: 400,
            message: "Something Went Wrong",
            data: _context11.t0
          }));

        case 28:
        case "end":
          return _context11.stop();
      }
    }
  }, null, null, [[0, 24]]);
};

exports.registerBulkUser = function _callee13(req, res) {
  var userData, depData, divData, desData, reportData, clientAdmin, count;
  return regeneratorRuntime.async(function _callee13$(_context13) {
    while (1) {
      switch (_context13.prev = _context13.next) {
        case 0:
          _context13.prev = 0;
          userData = req.body;
          _context13.next = 4;
          return regeneratorRuntime.awrap(req.config.departments.findAll());

        case 4:
          depData = _context13.sent;
          _context13.next = 7;
          return regeneratorRuntime.awrap(req.config.divisions.findAll());

        case 7:
          divData = _context13.sent;
          _context13.next = 10;
          return regeneratorRuntime.awrap(req.config.designations.findAll());

        case 10:
          desData = _context13.sent;
          _context13.next = 13;
          return regeneratorRuntime.awrap(req.config.users.findAll());

        case 13:
          reportData = _context13.sent;
          _context13.next = 16;
          return regeneratorRuntime.awrap(db.clients.findOne({
            where: {
              db_name: req.user.db_name,
              isDB: true
            }
          }));

        case 16:
          clientAdmin = _context13.sent;
          _context13.next = 19;
          return regeneratorRuntime.awrap(req.config.users.count({
            where: {
              isDB: false
            }
          }));

        case 19:
          count = _context13.sent;

          if (!(count >= clientAdmin.no_of_license)) {
            _context13.next = 24;
            break;
          }

          _context13.next = 23;
          return regeneratorRuntime.awrap(responseError(req, res, "cannot add more user, user count exceed the license count"));

        case 23:
          return _context13.abrupt("return", _context13.sent);

        case 24:
          if (!(parseInt(count) + parseInt(userData.length) >= clientAdmin.no_of_license)) {
            _context13.next = 28;
            break;
          }

          _context13.next = 27;
          return regeneratorRuntime.awrap(responseError(req, res, "can add bulk user ".concat(parseInt(count) + parseInt(userData.length) - clientAdmin.no_of_license)));

        case 27:
          return _context13.abrupt("return", _context13.sent);

        case 28:
          _context13.next = 30;
          return regeneratorRuntime.awrap(Promise.all(userData.map(function _callee12(item, i) {
            var dbUserData;
            return regeneratorRuntime.async(function _callee12$(_context12) {
              while (1) {
                switch (_context12.prev = _context12.next) {
                  case 0:
                    item.user = item["User Name"];
                    item.user_code = randomCodeGenrator("USER");
                    item.email = item["Email"] !== "" ? item["Email"] : null;
                    item.contact_number = item["Contact number"] !== "" ? item["Contact number"] : null;
                    _context12.next = 6;
                    return regeneratorRuntime.awrap(bcrypt.hash("12345", 10));

                  case 6:
                    item.password = _context12.sent;
                    item.db_name = clientAdmin.db_name;
                    item.country_id = 1;
                    item.address = item["Address"] !== "" ? item["Address"] : null;
                    item.pincode = item["Pincode"] !== "" ? item["Pincode"] : null;
                    item.subscription_start_date = clientAdmin.subscription_start_date;
                    item.subscription_end_date = clientAdmin.subscription_end_date; // divison map

                    if (!(item["Divison"] !== "")) {
                      _context12.next = 19;
                      break;
                    }

                    _context12.next = 16;
                    return regeneratorRuntime.awrap(Promise.all(divData.map(function (el, i) {
                      if (item["Divison"] == el.dataValues.divison) {
                        item.div_id = el.dataValues.div_id;
                        return el;
                      }
                    })));

                  case 16:
                    if (item.div_id === undefined) {
                      item.div_id = null;
                    }

                    _context12.next = 20;
                    break;

                  case 19:
                    item.div_id = null;

                  case 20:
                    if (!(item["Department"] !== "")) {
                      _context12.next = 26;
                      break;
                    }

                    _context12.next = 23;
                    return regeneratorRuntime.awrap(Promise.all(depData.map(function (el, i) {
                      if (item["Department"] == el.dataValues.department) {
                        item.dep_id = el.dataValues.dep_id;
                        return el;
                      }
                    })));

                  case 23:
                    if (item.dep_id === undefined) {
                      item.dep_id = null;
                    }

                    _context12.next = 27;
                    break;

                  case 26:
                    item.dep_id = null;

                  case 27:
                    if (!(item["Designation"] !== "")) {
                      _context12.next = 33;
                      break;
                    }

                    _context12.next = 30;
                    return regeneratorRuntime.awrap(Promise.all(desData.map(function (el, i) {
                      if (item["Designation"] == el.dataValues.designation) {
                        item.des_id = el.dataValues.des_id;
                        return el;
                      }
                    })));

                  case 30:
                    if (item.des_id === undefined) {
                      item.des_id = null;
                    }

                    _context12.next = 34;
                    break;

                  case 33:
                    item.des_id = null;

                  case 34:
                    if (!(item["Report To"] !== "")) {
                      _context12.next = 40;
                      break;
                    }

                    _context12.next = 37;
                    return regeneratorRuntime.awrap(Promise.all(reportData.map(function (el, i) {
                      if (item["Report To"] == el.dataValues.user) {
                        item.report_to = el.dataValues.user_id;
                        return el;
                      }
                    })));

                  case 37:
                    if (item.report_to === undefined) {
                      item.report_to = null;
                    }

                    _context12.next = 41;
                    break;

                  case 40:
                    item.report_to = null;

                  case 41:
                    _context12.next = 43;
                    return regeneratorRuntime.awrap(db.clients.create(item));

                  case 43:
                    _context12.next = 45;
                    return regeneratorRuntime.awrap(req.config.users.create(item));

                  case 45:
                    dbUserData = _context12.sent;
                    item.user_id = dbUserData.user_id;
                    _context12.next = 49;
                    return regeneratorRuntime.awrap(req.config.usersProfiles.create(item));

                  case 49:
                    return _context12.abrupt("return", item);

                  case 50:
                  case "end":
                    return _context12.stop();
                }
              }
            });
          })));

        case 30:
          _context13.next = 32;
          return regeneratorRuntime.awrap(responseSuccess(req, res, "Owner list", userData));

        case 32:
          return _context13.abrupt("return", _context13.sent);

        case 35:
          _context13.prev = 35;
          _context13.t0 = _context13["catch"](0);
          console.log(_context13.t0);
          _context13.next = 40;
          return regeneratorRuntime.awrap(responseError(req, res, "Error", _context13.t0));

        case 40:
          return _context13.abrupt("return", _context13.sent);

        case 41:
        case "end":
          return _context13.stop();
      }
    }
  }, null, null, [[0, 35]]);
};

exports.registrationTokenVerification = function _callee14(req, res) {
  var token, decoded, currentTime, ud, user;
  return regeneratorRuntime.async(function _callee14$(_context14) {
    while (1) {
      switch (_context14.prev = _context14.next) {
        case 0:
          _context14.prev = 0;
          token = req.body.token;
          _context14.next = 4;
          return regeneratorRuntime.awrap(promisify(jwt.verify)(token, process.env.SECRET_KEY));

        case 4:
          decoded = _context14.sent;
          currentTime = Math.floor(Date.now() / 1000); // Current time in seconds

          if (!(decoded && decoded.exp < currentTime)) {
            _context14.next = 10;
            break;
          }

          _context14.next = 9;
          return regeneratorRuntime.awrap(responseError(req, res, "Token has expired"));

        case 9:
          return _context14.abrupt("return", _context14.sent);

        case 10:
          _context14.next = 12;
          return regeneratorRuntime.awrap(first(decoded.db_name, req, res));

        case 12:
          ud = _context14.sent;

          if (ud) {
            _context14.next = 17;
            break;
          }

          _context14.next = 16;
          return regeneratorRuntime.awrap(responseError(req, res, "Database not found"));

        case 16:
          return _context14.abrupt("return", _context14.sent);

        case 17:
          _context14.next = 19;
          return regeneratorRuntime.awrap(ud.users.findByPk(decoded.id));

        case 19:
          user = _context14.sent;

          if (user) {
            _context14.next = 24;
            break;
          }

          _context14.next = 23;
          return regeneratorRuntime.awrap(responseError(req, res, "No  data found of channel partner"));

        case 23:
          return _context14.abrupt("return", _context14.sent);

        case 24:
          _context14.next = 26;
          return regeneratorRuntime.awrap(responseSuccess(req, res, "User token verified.", user));

        case 26:
          return _context14.abrupt("return", _context14.sent);

        case 29:
          _context14.prev = 29;
          _context14.t0 = _context14["catch"](0);
          _context14.next = 33;
          return regeneratorRuntime.awrap(responseError(req, res, "Error", _context14.t0));

        case 33:
          return _context14.abrupt("return", _context14.sent);

        case 34:
        case "end":
          return _context14.stop();
      }
    }
  }, null, null, [[0, 29]]);
};

exports.cpCompleteRegistration = function _callee15(req, res) {
  var _req$body2, token, name, mobile, decoded, currentTime, ud, user, aadhar, pan, rera, cheque;

  return regeneratorRuntime.async(function _callee15$(_context15) {
    while (1) {
      switch (_context15.prev = _context15.next) {
        case 0:
          _context15.prev = 0;
          _req$body2 = req.body, token = _req$body2.token, name = _req$body2.name, mobile = _req$body2.mobile;
          _context15.next = 4;
          return regeneratorRuntime.awrap(promisify(jwt.verify)(token, process.env.SECRET_KEY));

        case 4:
          decoded = _context15.sent;
          currentTime = Math.floor(Date.now() / 1000); // Current time in seconds

          if (!(decoded && decoded.exp < currentTime)) {
            _context15.next = 10;
            break;
          }

          _context15.next = 9;
          return regeneratorRuntime.awrap(responseError(req, res, "Token has expired"));

        case 9:
          return _context15.abrupt("return", _context15.sent);

        case 10:
          _context15.next = 12;
          return regeneratorRuntime.awrap(first(decoded.db_name, req, res));

        case 12:
          ud = _context15.sent;
          _context15.next = 15;
          return regeneratorRuntime.awrap(ud.users.findByPk(decoded.id));

        case 15:
          user = _context15.sent;

          if (user) {
            _context15.next = 20;
            break;
          }

          _context15.next = 19;
          return regeneratorRuntime.awrap(responseError(req, res, "No  data found of channel partner"));

        case 19:
          return _context15.abrupt("return", _context15.sent);

        case 20:
          if (!(!req.files || !req.files.aadhar)) {
            _context15.next = 24;
            break;
          }

          _context15.next = 23;
          return regeneratorRuntime.awrap(responseError(req, res, "Aadhar is required."));

        case 23:
          return _context15.abrupt("return", _context15.sent);

        case 24:
          if (!(!req.files || !req.files.pan)) {
            _context15.next = 28;
            break;
          }

          _context15.next = 27;
          return regeneratorRuntime.awrap(responseError(req, res, "Pan is required."));

        case 27:
          return _context15.abrupt("return", _context15.sent);

        case 28:
          if (!(!req.files || !req.files.rera)) {
            _context15.next = 32;
            break;
          }

          _context15.next = 31;
          return regeneratorRuntime.awrap(responseError(req, res, "Rera is required."));

        case 31:
          return _context15.abrupt("return", _context15.sent);

        case 32:
          if (!(!req.files || !req.files.cancel_check)) {
            _context15.next = 36;
            break;
          }

          _context15.next = 35;
          return regeneratorRuntime.awrap(responseError(req, res, "Cancel check is required."));

        case 35:
          return _context15.abrupt("return", _context15.sent);

        case 36:
          aadhar = "";
          pan = "";
          rera = "";
          cheque = "";

          if (!(req.files && req.files.aadhar)) {
            _context15.next = 45;
            break;
          }

          _context15.next = 43;
          return regeneratorRuntime.awrap(fileUpload.imageExport(req, res, "adh", "aadhar"));

        case 43:
          aadharName = _context15.sent;
          aadhar = aadharName;

        case 45:
          if (!(req.files && req.files.pan)) {
            _context15.next = 50;
            break;
          }

          _context15.next = 48;
          return regeneratorRuntime.awrap(fileUpload.imageExport(req, res, "adh", "pan"));

        case 48:
          panName = _context15.sent;
          pan = panName;

        case 50:
          if (!(req.files && req.files.aadhar)) {
            _context15.next = 55;
            break;
          }

          _context15.next = 53;
          return regeneratorRuntime.awrap(fileUpload.imageExport(req, res, "adh", "rera"));

        case 53:
          reraName = _context15.sent;
          rera = reraName;

        case 55:
          if (!(req.files && req.files.cheque)) {
            _context15.next = 60;
            break;
          }

          _context15.next = 58;
          return regeneratorRuntime.awrap(fileUpload.imageExport(req, res, "adh", "cheque"));

        case 58:
          chequeName = _context15.sent;
          cheque = chequeName;

        case 60:
          user.name = name;
          user.mobile = mobile;
          user.aadhar = aadhar;
          user.pan = pan;
          user.rera = rera;
          user.cheque = cheque;
          _context15.next = 68;
          return regeneratorRuntime.awrap(user.save());

        case 68:
          _context15.next = 70;
          return regeneratorRuntime.awrap(responseSuccess(req, res, "Channel partner document uploaded.", user));

        case 70:
          return _context15.abrupt("return", _context15.sent);

        case 73:
          _context15.prev = 73;
          _context15.t0 = _context15["catch"](0);
          console.log(_context15.t0);
          _context15.next = 78;
          return regeneratorRuntime.awrap(responseError(req, res, "Error", _context15.t0));

        case 78:
          return _context15.abrupt("return", _context15.sent);

        case 79:
        case "end":
          return _context15.stop();
      }
    }
  }, null, null, [[0, 73]]);
};