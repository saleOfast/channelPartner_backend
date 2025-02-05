"use strict";

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var _require = require("sequelize"),
    where = _require.where,
    Op = _require.Op;

var _require2 = require("../../helper/responce"),
    responseError = _require2.responseError,
    responseSuccess = _require2.responseSuccess;

var fileUpload = require("../../common/imageExport");

exports.getList = function _callee(req, res) {
  var brandList;
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          _context.next = 3;
          return regeneratorRuntime.awrap(req.config.dmsBrand.findAll({}));

        case 3:
          brandList = _context.sent;
          return _context.abrupt("return", responseSuccess(req, res, "Brand List Fetch Successfully.", brandList));

        case 7:
          _context.prev = 7;
          _context.t0 = _context["catch"](0);
          return _context.abrupt("return", responseError(req, res, "Brand List Fetch Failed."));

        case 10:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 7]]);
};

exports.getById = function _callee2(req, res) {
  var brand_id, existingBrand, brandList;
  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;

          if (req.query.brand_id) {
            _context2.next = 3;
            break;
          }

          return _context2.abrupt("return", responseError(req, res, "Brand Id Not Found."));

        case 3:
          brand_id = req.query.brand_id;
          _context2.next = 6;
          return regeneratorRuntime.awrap(req.config.dmsBrand.findByPk(brand_id));

        case 6:
          existingBrand = _context2.sent;

          if (existingBrand) {
            _context2.next = 9;
            break;
          }

          return _context2.abrupt("return", responseError(req, res, "Brand not found."));

        case 9:
          _context2.next = 11;
          return regeneratorRuntime.awrap(req.config.dmsBrand.findOne({
            where: {
              brand_id: brand_id
            }
          }));

        case 11:
          brandList = _context2.sent;
          return _context2.abrupt("return", responseSuccess(req, res, "Brand Fetch Successfully.", brandList));

        case 15:
          _context2.prev = 15;
          _context2.t0 = _context2["catch"](0);
          return _context2.abrupt("return", responseError(req, res, "Brand Fetch Failed."));

        case 18:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[0, 15]]);
};

exports.createBrand = function _callee3(req, res) {
  var brand_name, existingBrand, body, brand;
  return regeneratorRuntime.async(function _callee3$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _context3.prev = 0;
          brand_name = req.body.brand_name; // Check if brand with the same code already exists

          _context3.next = 4;
          return regeneratorRuntime.awrap(req.config.dmsBrand.findOne({
            where: {
              brand_name: brand_name
            }
          }));

        case 4:
          existingBrand = _context3.sent;

          if (!existingBrand) {
            _context3.next = 7;
            break;
          }

          return _context3.abrupt("return", responseError(req, res, "Brand already exists."));

        case 7:
          body = {
            brand_name: brand_name
          };

          if (!(req.files && req.files.file)) {
            _context3.next = 13;
            break;
          }

          _context3.next = 11;
          return regeneratorRuntime.awrap(fileUpload.imageExport(req, res, "brand"));

        case 11:
          aadharImage = _context3.sent;
          body.brand_image = aadharImage;

        case 13:
          _context3.next = 15;
          return regeneratorRuntime.awrap(req.config.dmsBrand.create(body));

        case 15:
          brand = _context3.sent;
          return _context3.abrupt("return", responseSuccess(req, res, "Brand Created Successfully.", brand));

        case 19:
          _context3.prev = 19;
          _context3.t0 = _context3["catch"](0);
          console.log("error", _context3.t0);
          return _context3.abrupt("return", responseError(req, res, "Brand Creation Failed."));

        case 23:
        case "end":
          return _context3.stop();
      }
    }
  }, null, null, [[0, 19]]);
};

exports.updateBrand = function _callee4(req, res) {
  var _req$body, brand_id, brand_name, updatedFields, existingBrand, imageName, updatedBrand;

  return regeneratorRuntime.async(function _callee4$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          _context4.prev = 0;
          _req$body = req.body, brand_id = _req$body.brand_id, brand_name = _req$body.brand_name;
          updatedFields = {
            brand_name: brand_name
          };
          _context4.next = 5;
          return regeneratorRuntime.awrap(req.config.dmsBrand.findOne({
            where: {
              brand_name: brand_name,
              brand_id: _defineProperty({}, Op.ne, brand_id)
            }
          }));

        case 5:
          pData = _context4.sent;

          if (!pData) {
            _context4.next = 8;
            break;
          }

          return _context4.abrupt("return", responseError(req, res, "Brand already exist"));

        case 8:
          _context4.next = 10;
          return regeneratorRuntime.awrap(req.config.dmsBrand.findByPk(brand_id));

        case 10:
          existingBrand = _context4.sent;

          if (existingBrand) {
            _context4.next = 13;
            break;
          }

          return _context4.abrupt("return", responseError(req, res, "Brand not found."));

        case 13:
          if (!(req.files && req.files.file)) {
            _context4.next = 18;
            break;
          }

          _context4.next = 16;
          return regeneratorRuntime.awrap(fileUpload.imageExport(req, res, "brand"));

        case 16:
          imageName = _context4.sent;
          updatedFields.brand_image = imageName;

        case 18:
          _context4.next = 20;
          return regeneratorRuntime.awrap(existingBrand.update(updatedFields));

        case 20:
          _context4.next = 22;
          return regeneratorRuntime.awrap(req.config.dmsBrand.findByPk(brand_id));

        case 22:
          updatedBrand = _context4.sent;
          return _context4.abrupt("return", responseSuccess(req, res, "Brand Updated Successfully.", updatedBrand));

        case 26:
          _context4.prev = 26;
          _context4.t0 = _context4["catch"](0);
          console.log("error", _context4.t0);
          return _context4.abrupt("return", responseError(req, res, "Brand Update Failed."));

        case 30:
        case "end":
          return _context4.stop();
      }
    }
  }, null, null, [[0, 26]]);
};

exports.deleteBrand = function _callee5(req, res) {
  var brand_id, existingBrand;
  return regeneratorRuntime.async(function _callee5$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          _context5.prev = 0;

          if (req.query.brand_id) {
            _context5.next = 3;
            break;
          }

          return _context5.abrupt("return", responseError(req, res, "Brand Id Not Found."));

        case 3:
          brand_id = req.query.brand_id;
          _context5.next = 6;
          return regeneratorRuntime.awrap(req.config.dmsBrand.findByPk(brand_id));

        case 6:
          existingBrand = _context5.sent;

          if (existingBrand) {
            _context5.next = 9;
            break;
          }

          return _context5.abrupt("return", responseError(req, res, "Brand not found."));

        case 9:
          if (existingBrand.brand_image) {
            req.body._imageName = existingBrand.brand_image;
          }

          _context5.next = 12;
          return regeneratorRuntime.awrap(existingBrand.destroy());

        case 12:
          if (!req.body._imageName) {
            _context5.next = 15;
            break;
          }

          _context5.next = 15;
          return regeneratorRuntime.awrap(fileUpload.imageExport(req, res, "brand"));

        case 15:
          return _context5.abrupt("return", responseSuccess(req, res, "Brand Deleted Successfully."));

        case 18:
          _context5.prev = 18;
          _context5.t0 = _context5["catch"](0);
          console.log("error", _context5.t0);
          return _context5.abrupt("return", responseError(req, res, "Brand Deletion Failed."));

        case 22:
        case "end":
          return _context5.stop();
      }
    }
  }, null, null, [[0, 18]]);
};