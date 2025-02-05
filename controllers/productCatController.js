const { Sequelize, DataTypes, QueryTypes, where, Op } = require("sequelize");
const { responseError, responseSuccess } = require("../helper/responce");
const fileUpload = require("../common/imageExport");

exports.storeProductCat = async (req, res) => {
  try {
    let { p_cat_name, parent_id, parent_name } = req.body;
    let pData;
    pData = await req.config.productCategories.findOne({
      where: {
        p_cat_name: p_cat_name,
        parent_id: parent_id,
      },
    });
    if (pData) return responseError(req, res, "product category already exist");

    pCount = await req.config.productCategories.count({ paranoid: false });
    let bpody = {
      p_cat_name,
      parent_id,
      parent_name,
      p_cat_code: `p_cat_${pCount + 1}`,
      status: true,
    };

    if (req.files && req.files.image) {
      imageName = await fileUpload.imageExport(req, res, "category", "image");
      bpody.image = imageName;
    } else{
      bpody.image = 'CATEGORY.png';
    }

    pData = await req.config.productCategories.create(bpody);

    return responseSuccess(
      req,
      res,
      "product category created successfuly",
      pData
    );
  } catch (error) {
    logErrorToFile(error)
    console.log("error", error);
    return responseError(req, res, "Something Went Wrong");
  }
};

exports.registerBulkProductCategory = async (req, res) => {
  try {
    let productCateBody = req.body;
    console.log(productCateBody);

    // Create categories without parent categories
    for (let i = 0; i < productCateBody.length; i++) {
      const item = productCateBody[i];
      let pCatData = await req.config.productCategories.findOne({
        where: {
          p_cat_name: item["Product Category Name"],
        },
      });

      if (!pCatData) {
        let pCount = await req.config.productCategories.count({
          paranoid: false,
        });
        item.p_cat_code = `p_cat_${pCount}`;
        item.p_cat_name = item["Product Category Name"];
        item.parent_id = 0;
        item.parent_name = null;
        await req.config.productCategories.create(item);
      }
    }

    // Update parent categories of child categories
    for (let i = 0; i < productCateBody.length; i++) {
      const item = productCateBody[i];
      if (item["Parent Name"] != 0) {
        let childData = await req.config.productCategories.findOne({
          where: {
            p_cat_name: item["Product Category Name"],
          },
        });
        let parentData = await req.config.productCategories.findOne({
          where: {
            p_cat_name: item["Parent Name"],
          },
        });
        if (childData && parentData) {
          childData.parent_id = parentData.p_cat_id;
          childData.parent_name = parentData.p_cat_name;
          item.status = 1;
          await childData.save();
        }
      }
    }

    return await responseSuccess(req, res, "Category list Update");
  } catch (error) {
    logErrorToFile(error)
    console.log(error);
    return await responseError(req, res, "Error", error);
  }
};

let AllData = []; // store all Menu Data

const child = (item, i) => {
  let newobj = item;

  var countChild = AllData.filter((obj, j) => {
    return item.p_cat_id === obj.parent_id;
  });

  // invoking the call back function

  if (countChild.length > 0) {
    countChild.map((ele, i) => {
      let data = child(ele, i);
      if (newobj["children"] !== undefined) {
        newobj.children.push(data);
      } else {
        newobj.children = [data];
      }
    });
    return newobj;
  } else {
    newobj.children = [];
    return newobj;
  }
};

exports.getAllProductCat = async (req, res) => {
  try {
    let pData = await req.config.sequelize.query(
      "SELECT p_cat_id, p_cat_code, p_cat_name, parent_id, parent_name , status FROM db_p_cats where deletedAt is null",
      {
        type: QueryTypes.SELECT,
      }
    );

    return responseSuccess(req, res, "product category list", pData);
  } catch (error) {
    logErrorToFile(error)
    console.log(error);
    return responseError(req, res, "Something Went Wrong");
  }
};

exports.getProductCat = async (req, res) => {
  try {
    let pData = await req.config.sequelize.query(
      "SELECT p_cat_id, p_cat_code, p_cat_name, parent_id, parent_name , status, image FROM db_p_cats where deletedAt is null",
      {
        type: QueryTypes.SELECT,
      }
    );
    if (pData.length > 0) {
      AllData = pData; // storing all the cats data
      var parent_data = pData.filter((obj, j) => {
        return obj.parent_id == 0;
      });

      var newArr = []; // storing tree data

      // initializing the child method first time

      parent_data.map((item, i) => {
        let finalData = child(item, i);
        newArr.push(finalData);
      });

      return responseSuccess(req, res, "product category list", newArr);
    } else {
      return responseSuccess(req, res, "product category list", pData);
    }
  } catch (error) {
    logErrorToFile(error)
    console.log(error);
    return responseError(req, res, "Something Went Wrong");
  }
};

exports.getOneProductCat = async (req, res) => {
  try {
    let pData = await req.config.productCategories.findOne({
      where: {
        p_cat_id: req.query.p_id,
      },
    });

    return responseSuccess(req, res, "product category detail", pData);
  } catch (error) {
    logErrorToFile(error)
    return responseError(req, res, "something ent wrong");
  }
};
exports.editProductCat = async (req, res) => {
  try {
    let { p_cat_name, parent_id, p_cat_id } = req.body;
    let pData;

    if (p_cat_name) {
      pData = await req.config.productCategories.findOne({
        where: {
          p_cat_name: p_cat_name,
          parent_id: parent_id,
          p_cat_id: { [Op.ne]: p_cat_id },
        },
      });
      if (pData)
        return responseError(req, res, "product category already exist");
    }

    pData = req.body;
    if (req.files && req.files.image) {
      imageName = await fileUpload.imageExport(req, res, "category", "image");
      pData.image = imageName;
    }
    await req.config.productCategories.update(pData, {
      where: {
        p_cat_id: p_cat_id,
      },
    });
    pData = await req.config.productCategories.findOne({
      where: {
        p_cat_id: p_cat_id,
      },
    });
    return responseSuccess(
      req,
      res,
      "product category updated successfuly",
      pData
    );
  } catch (error) {
    logErrorToFile(error)
    return responseError(req, res, "Something Went Wrong");
  }
};

exports.deleteProductCat = async (req, res) => {
  try {
    let { p_id } = req.query;
    let pData;

    pData = await req.config.productCategories.findOne({
      where: {
        p_cat_id: p_id,
      },
    });

  
    if (!pData)
      return responseError(req, res, "product category does not exist");
    if ( pData.image) {
      req.body._imageName = pData.image
      await fileUpload.imageExport(req, res, "category", "image");
    }
    await pData.destroy();
    
    return responseSuccess(req, res, "product category deleted successfuly");
  } catch (error) {
    logErrorToFile(error)
    console.log(error);
    return responseError(req, res, "Something Went Wrong");
  }
};

exports.getAllList = async (req, res) => {
  try {
    let pCatData = await req.config.productCategories.findAll({});
    return responseSuccess(
      req,
      res,
      "Category list fetch successfully",
      pCatData
    );
  } catch (error) {
    logErrorToFile(error)
    return responseError(req, res, "Something Went Wrong");
  }
};
