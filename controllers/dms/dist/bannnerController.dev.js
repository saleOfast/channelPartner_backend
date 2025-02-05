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
  var bannerList;
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          _context.next = 3;
          return regeneratorRuntime.awrap(req.config.dmsBanner.findAll({}));

        case 3:
          bannerList = _context.sent;
          return _context.abrupt("return", responseSuccess(req, res, "Banner List Fetch Successfully.", bannerList));

        case 7:
          _context.prev = 7;
          _context.t0 = _context["catch"](0);
          return _context.abrupt("return", responseError(req, res, "Banner List Fetch Failed."));

        case 10:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 7]]);
};

exports.getById = function _callee2(req, res) {
  var banner_id, existingBanner;
  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;

          if (req.query.banner_id) {
            _context2.next = 3;
            break;
          }

          return _context2.abrupt("return", responseError(req, res, "Banner Id Not Found."));

        case 3:
          banner_id = req.query.banner_id;
          _context2.next = 6;
          return regeneratorRuntime.awrap(req.config.dmsBanner.findByPk(banner_id));

        case 6:
          existingBanner = _context2.sent;

          if (existingBanner) {
            _context2.next = 9;
            break;
          }

          return _context2.abrupt("return", responseError(req, res, "Banner not found."));

        case 9:
          return _context2.abrupt("return", responseSuccess(req, res, "Banner Fetch Successfully.", existingBanner));

        case 12:
          _context2.prev = 12;
          _context2.t0 = _context2["catch"](0);
          return _context2.abrupt("return", responseError(req, res, "Banner Fetch Failed."));

        case 15:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[0, 12]]);
};

exports.createBanner = function _callee3(req, res) {
  var _req$body, banner_alt, start_date, end_date, banner_link, existingBanner, body, Banner;

  return regeneratorRuntime.async(function _callee3$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _context3.prev = 0;
          _req$body = req.body, banner_alt = _req$body.banner_alt, start_date = _req$body.start_date, end_date = _req$body.end_date, banner_link = _req$body.banner_link; // Check if Banner with the same code already exists

          _context3.next = 4;
          return regeneratorRuntime.awrap(req.config.dmsBanner.findOne({
            where: {
              banner_alt: banner_alt
            }
          }));

        case 4:
          existingBanner = _context3.sent;

          if (!existingBanner) {
            _context3.next = 7;
            break;
          }

          return _context3.abrupt("return", responseError(req, res, "Banner already exists."));

        case 7:
          body = {
            banner_alt: banner_alt,
            start_date: start_date,
            end_date: end_date,
            banner_link: banner_link
          };

          if (!(req.files && req.files.file)) {
            _context3.next = 19;
            break;
          }

          _context3.next = 11;
          return regeneratorRuntime.awrap(fileUpload.imageExport(req, res, "Banner"));

        case 11:
          imageName = _context3.sent;
          body.banner_image = imageName;
          _context3.next = 15;
          return regeneratorRuntime.awrap(req.config.dmsBanner.create(body));

        case 15:
          Banner = _context3.sent;
          return _context3.abrupt("return", responseSuccess(req, res, "Banner Created Successfully.", Banner));

        case 19:
          return _context3.abrupt("return", responseError(req, res, "no banner uploaded"));

        case 20:
          _context3.next = 26;
          break;

        case 22:
          _context3.prev = 22;
          _context3.t0 = _context3["catch"](0);
          console.log("error", _context3.t0);
          return _context3.abrupt("return", responseError(req, res, "Banner Creation Failed."));

        case 26:
        case "end":
          return _context3.stop();
      }
    }
  }, null, null, [[0, 22]]);
};

exports.updateBanner = function _callee4(req, res) {
  var _req$body2, banner_id, banner_alt, existingBanner, otherexist, _imageName, updatedBanner;

  return regeneratorRuntime.async(function _callee4$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          _context4.prev = 0;
          _req$body2 = req.body, banner_id = _req$body2.banner_id, banner_alt = _req$body2.banner_alt; // Check if Banner exists

          _context4.next = 4;
          return regeneratorRuntime.awrap(req.config.dmsBanner.findByPk(banner_id));

        case 4:
          existingBanner = _context4.sent;

          if (existingBanner) {
            _context4.next = 7;
            break;
          }

          return _context4.abrupt("return", responseError(req, res, "Banner not found."));

        case 7:
          if (!banner_alt) {
            _context4.next = 13;
            break;
          }

          _context4.next = 10;
          return regeneratorRuntime.awrap(req.config.dmsBanner.findOne({
            where: {
              banner_id: _defineProperty({}, Op.ne, banner_id),
              banner_alt: banner_alt
            }
          }));

        case 10:
          otherexist = _context4.sent;

          if (!otherexist) {
            _context4.next = 13;
            break;
          }

          return _context4.abrupt("return", responseError(req, res, "Banner Alt already exist"));

        case 13:
          if (!(req.files && req.files.file)) {
            _context4.next = 20;
            break;
          }

          _context4.next = 16;
          return regeneratorRuntime.awrap(fileUpload.imageExport(req, res, "Banner"));

        case 16:
          _imageName = _context4.sent;
          console.log('imageName', _imageName);
          req.body.banner_image = _imageName;
          console.log('req.body', req.body);

        case 20:
          _context4.next = 22;
          return regeneratorRuntime.awrap(existingBanner.update(req.body));

        case 22:
          _context4.next = 24;
          return regeneratorRuntime.awrap(req.config.dmsBanner.findByPk(banner_id));

        case 24:
          updatedBanner = _context4.sent;
          return _context4.abrupt("return", responseSuccess(req, res, "Banner Updated Successfully.", updatedBanner));

        case 28:
          _context4.prev = 28;
          _context4.t0 = _context4["catch"](0);
          console.log("error", _context4.t0);
          return _context4.abrupt("return", responseError(req, res, "Banner Update Failed."));

        case 32:
        case "end":
          return _context4.stop();
      }
    }
  }, null, null, [[0, 28]]);
};

exports.deleteBanner = function _callee5(req, res) {
  var banner_id, existingBanner;
  return regeneratorRuntime.async(function _callee5$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          _context5.prev = 0;

          if (req.query.banner_id) {
            _context5.next = 3;
            break;
          }

          return _context5.abrupt("return", responseError(req, res, "Banner Id Not Found."));

        case 3:
          banner_id = req.query.banner_id;
          _context5.next = 6;
          return regeneratorRuntime.awrap(req.config.dmsBanner.findByPk(banner_id));

        case 6:
          existingBanner = _context5.sent;

          if (existingBanner) {
            _context5.next = 9;
            break;
          }

          return _context5.abrupt("return", responseError(req, res, "Banner not found."));

        case 9:
          if (existingBanner.banner_image) {
            req.body._imageName = existingBanner.banner_image;
          }

          _context5.next = 12;
          return regeneratorRuntime.awrap(existingBanner.destroy());

        case 12:
          if (!req.body._imageName) {
            _context5.next = 15;
            break;
          }

          _context5.next = 15;
          return regeneratorRuntime.awrap(fileUpload.imageExport(req, res, "Banner"));

        case 15:
          return _context5.abrupt("return", responseSuccess(req, res, "Banner Deleted Successfully."));

        case 18:
          _context5.prev = 18;
          _context5.t0 = _context5["catch"](0);
          console.log("error", _context5.t0);
          return _context5.abrupt("return", responseError(req, res, "Banner Deletion Failed."));

        case 22:
        case "end":
          return _context5.stop();
      }
    }
  }, null, null, [[0, 18]]);
};