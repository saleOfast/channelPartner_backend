const path = require("path");
var fs = require('fs');

exports.createFolder = (req, res , folderpath)=> {
  try {

    const dirname = __dirname; // directory name of current module
    // const parentdir = dirname.split('/').slice(0, -1).join('/');

    var parentdir = path.resolve(
      __dirname,
      `../uploads`
    );

    const uploadDir = parentdir;
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir);
      // console.log(`Created directory: ${uploadDir}`);
    } else {
      // console.log(`Directory already exists: ${uploadDir}`);
    }
    
    const subdirs = ['adh', 'pan', 'rera','cheque','dl', 'lsUser', 'lsMenu', 'adminProfile' , 'temp', 'supportDoc', 'brand','category','product', 'banner','logo', 'clientdoc', 'brokerage', 'project', 'projectLogo', 'projectHtml', 'tempHouse'];
    
    subdirs.forEach((dir) => {
      const subDirPath = `${uploadDir}/${dir}`;
      if (!fs.existsSync(subDirPath)) {
        fs.mkdirSync(subDirPath);
        // console.log(`Created directory: ${subDirPath}`);
      } else {
        // console.log(`Directory already exists: ${subDirPath}`);
      }
    });
    
  } catch (error) {
    console.log(error)
  }

}