const { where, Op } = require("sequelize");
const { responseError, responseSuccess } = require("../../helper/responce");
const fileUpload = require("../../common/imageExport");

exports.getList = async (req, res) => {
  try {
    let brandList = await req.config.dmsBrand.findAll({});
    return responseSuccess(
      req,
      res,
      "Brand List Fetch Successfully.",
      brandList
    );
  } catch (error) {
    logErrorToFile(error)
    return responseError(req, res, "Brand List Fetch Failed.");
  }
};

exports.getById = async (req, res) => {
  try {
    if (!req.query.brand_id) {
      return responseError(req, res, "Brand Id Not Found.");
    }
    let brand_id = req.query.brand_id;
    let existingBrand = await req.config.dmsBrand.findByPk(brand_id);
    if (!existingBrand) {
      return responseError(req, res, "Brand not found.");
    }
    let brandList = await req.config.dmsBrand.findOne({
      where: {
        brand_id: brand_id,
      },
    });
    return responseSuccess(req, res, "Brand Fetch Successfully.", brandList);
  } catch (error) {
    logErrorToFile(error)
    return responseError(req, res, "Brand Fetch Failed.");
  }
};

exports.createBrand = async (req, res) => {
  try {
    const { brand_name } = req.body;

    // Check if brand with the same code already exists
    const existingBrand = await req.config.dmsBrand.findOne({
      where: {
        brand_name: brand_name,
      },
    });

    if (existingBrand) {
      return responseError(req, res, "Brand already exists.");
    }

    let body = {
      brand_name: brand_name,
    };

    if (req.files && req.files.file) {
      aadharImage = await fileUpload.imageExport(req, res, "brand");
      body.brand_image = aadharImage;
    }else{
      body.brand_image = 'BRAND.png'
    }

    let brand = await req.config.dmsBrand.create(body);
    return responseSuccess(req, res, "Brand Created Successfully.", brand);
  } catch (error) {
    logErrorToFile(error)
    console.log("error", error);
    return responseError(req, res, "Brand Creation Failed.");
  }
};

exports.updateBrand = async (req, res) => {
  try {
    const { brand_id, brand_name } = req.body;

    let updatedFields = {
      brand_name: brand_name,
    };

    pData = await req.config.dmsBrand.findOne({
      where: {
        brand_name: brand_name,
        brand_id: { [Op.ne]: brand_id },
      },
    });
    if (pData)
      return responseError(req, res, "Brand already exist");

    

    // Check if brand exists
    let existingBrand = await req.config.dmsBrand.findByPk(brand_id);
    if (!existingBrand) return responseError(req, res, "Brand not found.");

    if (req.files && req.files.file) {
      let imageName = await fileUpload.imageExport(req, res, "brand");
      updatedFields.brand_image = imageName;
    }

    await existingBrand.update(updatedFields);

    let updatedBrand = await req.config.dmsBrand.findByPk(brand_id);

    return responseSuccess(
      req,
      res,
      "Brand Updated Successfully.",
      updatedBrand
    );
  } catch (error) {
    logErrorToFile(error)
    console.log("error", error);
    return responseError(req, res, "Brand Update Failed.");
  }
};

exports.deleteBrand = async (req, res) => {
  try {
    if (!req.query.brand_id) {
      return responseError(req, res, "Brand Id Not Found.");
    }
    const brand_id = req.query.brand_id;

    let existingBrand = await req.config.dmsBrand.findByPk(brand_id);
    if (!existingBrand) {
      return responseError(req, res, "Brand not found.");
    }
    if (existingBrand.brand_image) {
      req.body._imageName = existingBrand.brand_image;
    }
    await existingBrand.destroy();
    if (req.body._imageName) {
      await fileUpload.imageExport(req, res, "brand");
    }

    return responseSuccess(req, res, "Brand Deleted Successfully.");
  } catch (error) {
    logErrorToFile(error)
    console.log("error", error);
    return responseError(req, res, "Brand Deletion Failed.");
  }
};
