const { where, Op } = require("sequelize");
const { responseError, responseSuccess } = require("../../helper/responce");

exports.getList = async (req, res) => {
  try {
    let cartList = await req.config.dmsCart.findAll({
      include: [
        { model: req.config.users, as: "userData" },
        { model: req.config.products, as: "productData" },
      ],
    });
    return responseSuccess(req, res, "Cart List Fetch Successfully.", cartList);
  } catch (error) {
    logErrorToFile(error)
    console.log("error", error);
    return responseError(req, res, "Cart List Fetch Failed.");
  }
};
exports.incrementCart = async (req, res) => {
  try {
    var { user_id, product_id, cases = 0, piece = 0 } = req.body;
    const user = await req.config.users.findByPk(user_id);
    if (!user) return responseError(req, res, "User not found.");
    //   check product
    const product = await req.config.products.findByPk(product_id);
    if (!product) return responseError(req, res, "Product not found.");

    let cart = await req.config.dmsCart.findOne({
      where: {
        product_id: product_id,
        user_id: user_id,
      },
    });
    if (cart) {
      cart.cases += cases;
      cart.piece += piece;
      await cart.save();
    } else {
      cart = await req.config.dmsCart.create({
        ...req.body,
        cases: cases || 0,
        piece: piece || 0,
      });
    }

    return responseSuccess(req, res, "Cart Created Successfully.", cart);
  } catch (error) {
    logErrorToFile(error)
    console.log("error", error);
    return responseError(req, res, "Cart Creation Failed.");
  }
};

exports.decrementCart = async (req, res) => {
  try {
    var { user_id, product_id, cases = 0, piece = 0 } = req.body;
    const user = await req.config.users.findByPk(user_id);
    if (!user) return responseError(req, res, "User not found.");
    //   check product
    const product = await req.config.products.findByPk(product_id);
    if (!product) return responseError(req, res, "Product not found.");

    const cart = await req.config.dmsCart.findOne({
      where: {
        product_id: product_id,
        user_id: user_id,
      },
    });
    if (cart) {
      if (cart.cases > 0) {
        cart.cases -= cases;
      }
      if (cart.piece > 0) {
        cart.piece -= piece;
      }
      await cart.save();
    }
    const responseCart = await req.config.dmsCart.findOne({
      where: {
        product_id: product_id,
        user_id: user_id,
      },
    });

    if (responseCart && responseCart.cases <= 0 && responseCart.piece <= 0) {
      await responseCart.destroy({ force: true });
    }

    return await responseSuccess(
      req,
      res,
      "Cart Updated Successfully.",
      responseCart
    );
  } catch (error) {
    logErrorToFile(error)
    console.log("error", error);
    return responseError(req, res, "Cart Update Failed.");
  }
};

exports.deleteCartItem = async (req, res) => {
  try {
    const { cart_id } = req.query;
    if (!cart_id) return responseError(req, res, "Cart id not found.");
    const cart = await req.config.dmsCart.findByPk(cart_id);

    if (!cart) return responseError(req, res, "Cart item not found.");
    await cart.destroy({ force: true });

    return await responseSuccess(req, res, "Cart Deleted Successfully.");
  } catch (error) {
    logErrorToFile(error)
    console.log("error", error);
    return responseError(req, res, "Cart Deletion Failed.");
  }
};

exports.clearCart = async (req, res) => {
  try {
    const { user_id } = req.query;
    if (!user_id) return responseError(req, res, "User id not found.");
    const cart = await req.config.dmsCart.findOne({
      where: {
        user_id: user_id,
      },
    });

    if (!cart) return responseError(req, res, "Cart is already empty.");

    await cart.destroy({
      where: {
        user_id: user_id,
      },
      force: true,
    });

    return await responseSuccess(req, res, "Cart Empty Successfully.");
  } catch (error) {
    logErrorToFile(error)
    console.log("error", error);
    return responseError(req, res, "Cart Deletion Failed.");
  }
};
