"use strict";

var path = require("path");

var fs = require('fs');

exports.createFolder = function (req, res, folderpath) {
  try {
    var dirname = __dirname; // directory name of current module
    // const parentdir = dirname.split('/').slice(0, -1).join('/');

    var parentdir = path.resolve(__dirname, "../uploads");
    var uploadDir = parentdir;

    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir); // console.log(`Created directory: ${uploadDir}`);
    } else {// console.log(`Directory already exists: ${uploadDir}`);
      }

    var subdirs = ['adh', 'pan', 'rera', 'cheque', 'dl', 'lsUser', 'lsMenu', 'adminProfile', 'temp', 'supportDoc', 'brand', 'category', 'product', 'banner'];
    subdirs.forEach(function (dir) {
      var subDirPath = "".concat(uploadDir, "/").concat(dir);

      if (!fs.existsSync(subDirPath)) {
        fs.mkdirSync(subDirPath); // console.log(`Created directory: ${subDirPath}`);
      } else {// console.log(`Directory already exists: ${subDirPath}`);
        }
    });
  } catch (error) {
    console.log(error);
  }
};