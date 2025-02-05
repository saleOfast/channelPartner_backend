const { where } = require("sequelize");
const { responseError, responseSuccess } = require("../../helper/responce");
const fileUpload = require("../../common/imageExport");

exports.getList = async (req, res) => {
  try {
    let couponList = await req.config.dmsCoupon.findAll({});
    return responseSuccess(
      req,
      res,
      "Coupon List Fetch Successfully.",
      couponList
    );
  } catch (error) {
    logErrorToFile(error)
    return responseError(req, res, "Coupon List Fetch Failed.");
  }
};

exports.getById = async (req, res) => {
  try {
    if (!req.query.coupon_id) {
      return responseError(req, res, "Coupon Id Not Found.");
    }
    let coupon_id = req.query.coupon_id;
    let existingCoupon = await req.config.dmsCoupon.findByPk(coupon_id);
    if (!existingCoupon) {
      return responseError(req, res, "Coupon not found.");
    }
    let couponList = await req.config.dmsCoupon.findOne({
      where: {
        coupon_id: coupon_id,
      },
    });
    return responseSuccess(req, res, "Coupon Fetch Successfully.", couponList);
  } catch (error) {
    logErrorToFile(error)
    return responseError(req, res, "Coupon Fetch Failed.");
  }
};

exports.createCoupon = async (req, res) => {
  try {
    const { type, use_type, coupon_name, value } = req.body;

    // Check if coupon with the same code already exists
    const existingCoupon = await req.config.dmsCoupon.findOne({
      where: {
        coupon_name: coupon_name,
      },
    });

    if (existingCoupon) {
      return responseError(req, res, "Coupon code already exists.");
    }

    let body = { type, use_type, coupon_name, value };

    let coupon = await req.config.dmsCoupon.create(body);
    return responseSuccess(req, res, "Coupon Created Successfully.", coupon);
  } catch (error) {
    logErrorToFile(error)
    console.log("error", error);
    return responseError(req, res, "Coupon Creation Failed.");
  }
};

exports.updateCoupon = async (req, res) => {
  try {
    const { coupon_id, type, use_type, coupon_name, value } = req.body;

    let updatedFields = { type, use_type, coupon_name, value };

    // Check if coupon exists
    let existingCoupon = await req.config.dmsCoupon.findByPk(coupon_id);
    if (!existingCoupon) return responseError(req, res, "Coupon not found.");

    await existingCoupon.update(updatedFields);

    let updatedCoupon = await req.config.dmsCoupon.findByPk(coupon_id);

    return responseSuccess(
      req,
      res,
      "Coupon Updated Successfully.",
      updatedCoupon
    );
  } catch (error) {
    logErrorToFile(error)
    console.log("error", error);
    return responseError(req, res, "Coupon Update Failed.");
  }
};

exports.deleteCoupon = async (req, res) => {
  try {
    if (!req.query.coupon_id) {
      return responseError(req, res, "Coupon Id Not Found.");
    }
    const coupon_id = req.query.coupon_id;

    let existingCoupon = await req.config.dmsCoupon.findByPk(coupon_id);
    if (!existingCoupon) {
      return responseError(req, res, "Coupon not found.");
    }
    await existingCoupon.destroy();
    return responseSuccess(req, res, "Coupon Deleted Successfully.");
  } catch (error) {
    logErrorToFile(error)
    console.log("error", error);
    return responseError(req, res, "Coupon Deletion Failed.");
  }
};
