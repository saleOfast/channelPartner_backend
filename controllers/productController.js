const { Sequelize, DataTypes, QueryTypes, where, Op } = require("sequelize");
const {
  responseError,
  responseSuccess,
  responseSuccessPaginate,
} = require("../helper/responce");
const fs = require("fs");
const path = require("path");
const xlsx = require("xlsx");
const fileUpload = require("../common/imageExport");

exports.storeProduct = async (req, res) => {
  try {
    let productData = req.body;

    let pData;
    pData = await req.config.products.findOne({
      where: {
        [Op.or]: [
          { p_name: productData.p_name },
          { p_code: productData.p_code },
        ],
      },
    });
    if (pData) return responseError(req, res, "product already exist");

    let brand = await req.config.dmsBrand.findByPk(productData.brand_id);
    if (!brand) return responseError(req, res, "brand not found.");

    if (req.files && req.files.image) {
      imageName = await fileUpload.imageExport(req, res, "product", "image");
      productData.image = imageName;
    } else {
      productData.image = 'PRODUCT.png';
    }

    pData = await req.config.products.create(productData);

    return responseSuccess(req, res, "product created successfuly", pData);
  } catch (error) {
    logErrorToFile(error)
    console.log(error);
    return responseError(req, res, "Something Went Wrong");
  }
};

exports.registerBulkProduct = async (req, res) => {
  try {
    let productBody = req.body;
    let categoryData = await req.config.productCategories.findAll();

    await Promise.all(
      productBody.map(async (item, i) => {
        let pData = await req.config.products.findOne({
          where: {
            [Op.or]: [
              { p_name: item["Product Name"] },
              { p_code: item["Product Code"] },
            ],
          },
        });

        if (!pData) {
          item.p_name = item["Product Name"];
          item.p_code = item["Product Code"];
          item.p_price = item["Price"] !== "" ? item["Price"] : null;
          item.p_desc = item["Description"] !== "" ? item["Description"] : null;
          item.status = 1;

          // divison map
          if (item["Product Category"] !== "") {
            await Promise.all(
              categoryData.map((el, i) => {
                if (item["Product Category"] == el.dataValues.p_cat_name) {
                  item.p_cat_id = el.dataValues.p_cat_name;
                  return el;
                }
              })
            );

            if (item.p_cat_id === undefined) {
              item.p_cat_id = null;
            }
          } else {
            item.p_cat_id = null;
          }

          await req.config.products.create(item);
        }
        return item;
      })
    );

    return await responseSuccess(req, res, "Product list Added");
  } catch (error) {
    logErrorToFile(error)
    console.log(error);
    return await responseError(req, res, "Error", error);
  }
};

exports.downloadExcelData = async (req, res) => {
  try {
    let products = await req.config.products.findAll({
      include: [{ model: req.config.productCategories, paranoid: false }],
      order: [["p_id", "DESC"]],
    });

    let excelClientData = [];
    products?.forEach((element) => {
      let item = {
        Name: element?.dataValues.p_name,
        Code: element?.dataValues.p_code,
        price: element?.dataValues.p_price,
        Category: element?.dataValues?.db_p_cat?.dataValues?.p_cat_name,
        Description: element?.dataValues.p_desc,
      };
      excelClientData.push(item);
    });
    // let excelClientData = lead?.map((item)=> item.dataValues)
    const workbook = xlsx.utils.book_new();
    const worksheet = xlsx.utils.json_to_sheet(excelClientData);
    // Add the worksheet to the workbook
    xlsx.utils.book_append_sheet(workbook, worksheet, "Sheet1");

    // Generate a temporary file path to save the Excel workbook
    const tempFilePath = path.join(
      __dirname,
      `../uploads/temp`,
      "temp.xlsx"
    );

    // Write the workbook to a file
    xlsx.writeFile(workbook, tempFilePath);

    // Set the response headers
    res.setHeader("Content-Type", "application/vnd.ms-excel");
    res.setHeader("Content-Disposition", "attachment; filename=example.xlsx");

    // Stream the file to the response
    const stream = fs.createReadStream(tempFilePath);
    stream.pipe(res);

    // Delete the temporary file after sending the response
    stream.on("end", () => {
      fs.unlinkSync(tempFilePath);
    });

    return;
  } catch (error) {
    logErrorToFile(error)
    console.log(error);
    return res
      .status(400)
      .json({ status: 400, message: "Something Went Wrong" });
  }
};

exports.getProduct = async (req, res) => {
  const process = await req.config.sequelize.transaction();
  try {
    let products;

    if (req.query.p_id) {
      products = await req.config.products.findOne({
        where: {
          p_id: req.query.p_id,
        },
        include: [
          { model: req.config.productCategories, paranoid: false },
          { model: req.config.dmsBrand, paranoid: false },
          {
            model: req.config.dmsCart, as: 'productCartList',
            attributes: ['cases', 'piece'],
            paranoid: false,
            where: {
              user_id: req.user.user_id,
              product_id: req.query.p_id,

            },
            required: false

          }
        ],
        order: [["p_id", "DESC"]],
      }, { transaction: process });
    } else {
      products = await req.config.products.findAll({
        include: [
          { model: req.config.productCategories, paranoid: false },
          { model: req.config.dmsBrand, paranoid: false },
          {
            model: req.config.dmsCart, as: 'productCartList',
            attributes: ['cases', 'piece'],
            paranoid: false,
            where: {
              user_id: req.user.user_id,
            },
            required: false
          }
        ],
        order: [["p_id", "DESC"]],
      }, { transaction: process });
    }
    await process.commit()
    await responseSuccess(req, res, "products list", products);
  } catch (error) {
    logErrorToFile(error)
    console.log(error);
    await process.rollback()
    return await responseError(req, res, "Something Went Wrong");
  }
};

exports.editProduct = async (req, res) => {
  try {
    let productData = req.body;
    const searchCriteria = {
      [Op.and]: [
        {
          [Op.or]: [
            { p_name: productData.p_name },
            { p_code: productData.p_code },
          ],
        },
        {
          p_id: {
            [Op.ne]: productData.p_id,
          },
        },
      ],
    };

    pData = await req.config.products.findAll({ where: searchCriteria });
    if (pData.length > 0)
      return responseError(req, res, "product already exist");

    if (req.files && req.files.image) {
      imageName = await fileUpload.imageExport(req, res, "product", "image");
      productData.image = imageName;
    }
    await req.config.products.update(productData, {
      where: {
        p_id: productData.p_id,
      },
    });
    product = await req.config.products.findOne({
      where: {
        p_id: productData.p_id,
      },
    });
    return responseSuccess(req, res, "product updated successfully", product);
  } catch (error) {
    logErrorToFile(error)
    console.log("error", error);

    return responseError(req, res, "Something Went Wrong");
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    let { p_id } = req.query;
    let pData;

    pData = await req.config.products.findOne({
      where: {
        p_id: p_id,
      },
    });
    if (!pData) return responseError(req, res, "product does not exist");

    if (pData.image) {
      req.body._imageName = pData.image;
      await fileUpload.imageExport(req, res, "product", "image");
    }
    await pData.destroy();

    return responseSuccess(req, res, "product deleted successfuly");
  } catch (error) {
    logErrorToFile(error)
    console.log(error);
    return responseError(req, res, "Something Went Wrong");
  }
};

exports.getShopItems = async (req, res) => {
  try {
    const { search, brand_id, category_id, page = 1, limit = 10 } = req.query;
    let whereCondition = {};

    // Apply filters based on brand_id and category_id
    if (brand_id) {
      whereCondition.brand_id = brand_id;
    }
    if (category_id) {
      whereCondition.p_cat_id = category_id;
    }

    // Search by product_name if search query is provided
    if (search) {
      whereCondition.p_name = { [Sequelize.Op.like]: `%${search}%` };
    }
    const offset = (page - 1) * limit;
    let { count, rows: products } = await req.config.products.findAndCountAll({
      where: whereCondition,
      include: [
        { model: req.config.productCategories, paranoid: false },
        { model: req.config.dmsBrand, paranoid: false },
      ],
      order: [["p_id", "DESC"]],
      limit: parseInt(limit),
      offset: offset,
    });
    const totalPages = Math.ceil(count / limit);

    return await responseSuccessPaginate(
      req,
      res,
      "products list",
      products,
      count,
      totalPages,
      parseInt(page),
      parseInt(limit)
    );
  } catch (error) {
    logErrorToFile(error)
    console.log(error);
    return await responseError(req, res, "Something Went Wrong");
  }
};
