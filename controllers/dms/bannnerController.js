const { where, Op } = require("sequelize");
const { responseError, responseSuccess } = require("../../helper/responce");
const fileUpload = require("../../common/imageExport");

exports.getList = async (req, res) => {
  try {
    let bannerList = await req.config.dmsBanner.findAll({});
    return responseSuccess(
      req,
      res,
      "Banner List Fetch Successfully.",
      bannerList
    );
  } catch (error) {
    logErrorToFile(error)
    return responseError(req, res, "Banner List Fetch Failed.");
  }
};

exports.getById = async (req, res) => {
  try {
    if (!req.query.banner_id) {
      return responseError(req, res, "Banner Id Not Found.");
    }
    let banner_id = req.query.banner_id;
    let existingBanner = await req.config.dmsBanner.findByPk(banner_id);
    if (!existingBanner) {
      return responseError(req, res, "Banner not found.");
    }
    return responseSuccess(req, res, "Banner Fetch Successfully.", existingBanner);
  } catch (error) {
    logErrorToFile(error)
    return responseError(req, res, "Banner Fetch Failed.");
  }
};

exports.createBanner = async (req, res) => {
  try {
    const { banner_alt, start_date, end_date, banner_link } = req.body;

    // Check if Banner with the same code already exists
    const existingBanner = await req.config.dmsBanner.findOne({
      where: {
        banner_alt: banner_alt,
        
      },
    });

    if (existingBanner) {
      return responseError(req, res, "Banner already exists.");
    }

    let body = {
        banner_alt,
        start_date,
        end_date,
        banner_link
      };
  

    if (req.files && req.files.file) {
        imageName = await fileUpload.imageExport(req, res, "Banner");
        body.banner_image = imageName;
        let Banner = await req.config.dmsBanner.create(body);
        return responseSuccess(req, res, "Banner Created Successfully.", Banner);
    }else{
        return responseError(req, res, "no banner uploaded");
    }


    
  } catch (error) {
    logErrorToFile(error)
    console.log("error", error);
    return responseError(req, res, "Banner Creation Failed.");
  }
};

exports.updateBanner = async (req, res) => {
  try {
    const { banner_id, banner_alt } = req.body;

    // Check if Banner exists
    let existingBanner = await req.config.dmsBanner.findByPk(banner_id);
    if (!existingBanner) return responseError(req, res, "Banner not found.");

     // Check if Banner exists
     if(banner_alt){
        let otherexist = await req.config.dmsBanner.findOne({
            where:{
                banner_id:  {[Op.ne]: banner_id},
                banner_alt
            }
        });
         if (otherexist) return responseError(req, res, "Banner Alt already exist");
    }
     


    if (req.files && req.files.file) {
      let imageName = await fileUpload.imageExport(req, res, "Banner");
      console.log('imageName', imageName)
      req.body.banner_image = imageName;
      console.log('req.body', req.body)
    }

    await existingBanner.update(req.body);
    
    let updatedBanner = await req.config.dmsBanner.findByPk(banner_id);

    return responseSuccess(
      req,
      res,
      "Banner Updated Successfully.",
      updatedBanner
    );
  } catch (error) {
    logErrorToFile(error)
    console.log("error", error);
    return responseError(req, res, "Banner Update Failed.");
  }
};

exports.deleteBanner = async (req, res) => {
  try {
    if (!req.query.banner_id) {
      return responseError(req, res, "Banner Id Not Found.");
    }
    const banner_id = req.query.banner_id;

    let existingBanner = await req.config.dmsBanner.findByPk(banner_id);
    if (!existingBanner) {
      return responseError(req, res, "Banner not found.");
    }
    if (existingBanner.banner_image) {
      req.body._imageName = existingBanner.banner_image;
    }
    await existingBanner.destroy();
    if (req.body._imageName) {
      await fileUpload.imageExport(req, res, "Banner");
    }

    return responseSuccess(req, res, "Banner Deleted Successfully.");
  } catch (error) {
    logErrorToFile(error)
    console.log("error", error);
    return responseError(req, res, "Banner Deletion Failed.");
  }
};


