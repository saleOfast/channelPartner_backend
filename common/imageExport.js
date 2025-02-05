const path = require("path");
var fs = require("fs");
const sharp = require('sharp');


exports.imageExport = async (req, res, folderpath, field_name = 'file') => {
    try {
        let body = req.body;
        // delete old file if exist
        console.log("i am here")
        if (body._imageName != 0) {
            var deleteuploadPath = path.resolve(
                __dirname,
                `../uploads/${folderpath}/images${body._imageName}`
            );
            fs.stat(deleteuploadPath, function (error, stats) {
                //here we got all information of file in stats variable

                if (error) {
                    return { status: 400, message: error };
                }

                fs.unlink(deleteuploadPath, function (error) {
                    if (error) return { status: 400, message: error };
                });
            });
        }

        // upload new file
        var file = req.files[field_name];
        if (!file) {
            return await responseError(req, res, `The file ${field_name} is ${file}`);
        }
        if (file) {
            const extName = path.extname(file.name);
            console.log("extName", extName)
            const imgList = [".png", ".jpg", ".jpeg", ".gif", ".pdf", '.JPG', '.PNG', '.JPEG', '.PDF', '.GIF', '.PDF', '.html', '.htm', '.csv'];
            if (!imgList.includes(extName)) {
                return { status: 400, message: "invalid file format" };
            }
            const image_name = Date.now() + extName;

            const uploadPath = path.resolve(
                __dirname,
                `../uploads/${folderpath}/images` + image_name
            );

            // Reduce image quality using sharp
            const image = sharp(file.data); // Use file.data to access the file buffer

            if (extName.toLowerCase() === '.jpeg' || extName.toLowerCase() === '.jpg') {
                image.jpeg({ quality: 30 }); // Adjust quality as needed for JPEG
            } else if (extName.toLowerCase() === '.png') {
                image.png({ quality: 30 }); // Adjust quality as needed for PNG
            } else if (extName.toLowerCase() === '.gif') {
                image.webp({ quality: 30 }); // Adjust quality as needed for GIF (convert to WebP)
            }

            const filelist = ['.pdf', '.html', '.docx', '.csv'];
            console.log('filelist', filelist, 'extName', extName.toLowerCase())
            if (filelist.includes(extName.toLowerCase())) {
                file.mv(uploadPath, function (error, result) {
                    if (error) {
                        return { status: 400, message: error };
                    }
                });
            } else {
                image.toFile(uploadPath, (error) => {
                    if (error) {
                        return { status: 400, message: error };
                    }
                });
            }
            return image_name;
        }
        return null
    } catch (error) {
        logErrorToFile(error)
        console.log("error in upload", error);
        return { status: 400, message: error };
    }
};


exports.deleteImage = async (req, res, folderpath, field_name = 'file') => {
    try {
        let body = req.body;
        // delete old file if exist

        if (body._imageName != 0) {
            var deleteuploadPath = path.resolve(
                __dirname,
                `../uploads/${folderpath}/images${body._imageName}`
            );
            fs.stat(deleteuploadPath, function (error, stats) {
                //here we got all information of file in stats variable

                if (error) {
                    return { status: 400, message: error };
                }

                fs.unlink(deleteuploadPath, function (error) {
                    if (error) return { status: 400, message: error };
                    return null
                });
            });
        }

    } catch (error) {
        logErrorToFile(error)
        console.log("error in upload", error);
        return { status: 400, message: error };
    }
};


exports.imageExportClick = async (file, body, folderpath) => {
    try {
        // delete old file if exist
        if (body._imageName != 0) {
            var deleteuploadPath = path.resolve(
                __dirname,
                `../uploads/${folderpath}/images${body._imageName}`
            );
            fs.stat(deleteuploadPath, function (err, stats) {
                // console.log(stats);//here we got all information of file in stats variable

                if (err) {
                    return { message: err };
                }

                fs.unlink(deleteuploadPath, function (err) {
                    if (err) return { message: err };
                    console.log("file deleted successfully");
                });
            });
        }

        // upload new file
        const files = file;
        const imgList = ["png", "jpg", "jpeg", "gif"];
        if (!imgList.includes(files.mimetype.split("/")[1])) {
            return { message: "Invalid image fromat." };
        }
        const image_name = Date.now() + "." + files.mimetype.split("/")[1];
        var uploadPath = path.resolve(
            __dirname,
            `../uploads/${folderpath}/images` + image_name
        );
        files.mv(uploadPath, function (err, result) {
            if (err) {
                return { message: err, where: "in the upload" };
            }
        });
        return image_name;
    } catch (error) {
        logErrorToFile(error)
        return { message: error, data: "in the error" };
    }
};

exports.csvUpload = async (req, res, folderpath, field_name = 'file') => {
    try {
        const file = req.files[field_name];
        if (!file) {
            return res.status(400).json({ message: `No file provided for ${field_name}` });
        }

        const extName = path.extname(file.name).toLowerCase();
        if (extName !== '.csv') {
            return res.status(400).json({ message: "Only CSV files are allowed" });
        }

        const file_name = Date.now() + extName;
        const uploadPath = path.resolve(__dirname, `../uploads/csv/${file_name}`);

        // Move the CSV file to the upload directory using async/await
        await file.mv(uploadPath); 

        return file_name

    } catch (error) {
        console.error("Error during CSV upload", error);
        return res.status(500).json({ message: "Internal server error: " + error.message });
    }
};

// exports.csvUpload = async (req, res, folderpath, field_name = 'file') => {
//     try {

//         const file = req.files[field_name];
//         if (!file) {
//             return res.status(400).json({ message: `No file provided for ${field_name}` });
//         }

//         const extName = path.extname(file.name).toLowerCase();
//         if (extName !== '.csv') {
//             return res.status(400).json({ message: "Only CSV files are allowed" });
//         }

//         const file_name = Date.now() + extName;
//         const uploadPath = path.resolve(__dirname, `../uploads/csv/${file_name}`);

//         // Move the CSV file to the upload directory
//         file.mv(uploadPath, function (error) {
//             if (error) {
//                 return res.status(500).json({ message: "File upload failed: " + error.message });
//             }
//         });
//         return file_name;

//     } catch (error) {
//         console.error("Error during CSV upload", error);
//         return res.status(500).json({ message: "Internal server error: " + error.message });
//     }
// };
