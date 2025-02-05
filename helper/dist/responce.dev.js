"use strict";

exports.responseSuccess = function _callee(req, res, message) {
  var data,
      t,
      _args = arguments;
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          data = _args.length > 3 && _args[3] !== undefined ? _args[3] : null;
          t = _args.length > 4 && _args[4] !== undefined ? _args[4] : null;
          return _context.abrupt("return", res.status(200).json({
            status: 200,
            message: message,
            data: data
          }));

        case 3:
        case "end":
          return _context.stop();
      }
    }
  });
};

exports.responseError = function _callee2(req, res, message) {
  var data,
      t,
      _args2 = arguments;
  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          data = _args2.length > 3 && _args2[3] !== undefined ? _args2[3] : null;
          t = _args2.length > 4 && _args2[4] !== undefined ? _args2[4] : null;
          return _context2.abrupt("return", res.status(400).json({
            status: 400,
            message: message,
            data: data
          }));

        case 3:
        case "end":
          return _context2.stop();
      }
    }
  });
};

exports.responseSuccessPaginate = function _callee3(req, res, message) {
  var data,
      totalCount,
      totalPages,
      currentPage,
      pageSize,
      _args3 = arguments;
  return regeneratorRuntime.async(function _callee3$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          data = _args3.length > 3 && _args3[3] !== undefined ? _args3[3] : null;
          totalCount = _args3.length > 4 ? _args3[4] : undefined;
          totalPages = _args3.length > 5 ? _args3[5] : undefined;
          currentPage = _args3.length > 6 ? _args3[6] : undefined;
          pageSize = _args3.length > 7 ? _args3[7] : undefined;
          _context3.next = 7;
          return regeneratorRuntime.awrap(req.config.sequelize.close());

        case 7:
          return _context3.abrupt("return", res.status(200).json({
            status: 200,
            message: message,
            data: data,
            totalCount: totalCount,
            totalPages: totalPages,
            currentPage: currentPage,
            pageSize: pageSize
          }));

        case 8:
        case "end":
          return _context3.stop();
      }
    }
  });
};