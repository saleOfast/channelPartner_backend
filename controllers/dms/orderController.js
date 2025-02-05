const { where, Op } = require("sequelize");
const { responseError, responseSuccess } = require("../../helper/responce");


function formatNumber(num) {
  if (Number.isInteger(num)) {
      return num.toFixed(2);
  } else {
      return Math.round(num * 100) / 100;
  }
}


function generateRandomString(prefix, length) {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = prefix || ''; // If no prefix is provided, default to an empty string

  for (let i = result.length; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      result += characters.charAt(randomIndex);
  }

  return result;
}


const discount = (price, discount= 0, unitInCase = 0, casees=0) =>{

  const totalCurrentPrice = price* unitInCase * casees

  return  formatNumber((totalCurrentPrice*discount)/100)
}

const totalDiscount = (price, discount= 0) =>{

  return  formatNumber((price*discount)/100)
}


exports.getAllOrderOfUser = async (req, res) => {
  try {

    const {page=1, limit=10} = req.query
    let OrderList = await req.config.dmsOrder.findAll({
      include: [
        { model: req.config.users, as: "orderuserData",
          
        },
        {
          model: req.config.dmsOrderItems,
          as: 'orderItemList',
          include: [
            {model: req.config.products, as: "OrderProductData"}
          ]
          
        }
      ],
      offset: (page-1)*limit, limit: limit 
    });

   
    return responseSuccess(req, res, "OrderList", {
      page: page,
      limit: limit,
      data: OrderList
    });
  } catch (error) {
    logErrorToFile(error)
    console.log("error", error);
    return responseError(req, res, "Cart List Fetch Failed.");
  }
};

exports.createOrder = async (req, res) => {
  const process = await req.config.sequelize.transaction();
  try {

    const {cartData, p_status = 'paid', voucher_type, voucher_value} = req.body
    let total_cart_value = 0

    if(cartData.length > 0){
      let user_id = req.user.user_id
      const currentOrder = await req.config.dmsOrder.create({
        user_id,
        payment_id: generateRandomString('pay_', 8),
        order_id: generateRandomString('ord_', 8),
        signature: generateRandomString('sig_', 12),
        p_status
        
      },)
      
      for (let index = 0; index < cartData.length; index++) {

        const element = cartData[index];
        const currentProduct = await req.config.products.findByPk(element.product_id,{transaction: process})

        total_cart_value += (element.cases * currentProduct.dataValues.p_price* currentProduct.dataValues.unit_in_case ) - discount(currentProduct.dataValues.p_price, currentProduct.dataValues.product_discount, currentProduct.dataValues.unit_in_case, element.cases) + (element.piece* currentProduct.dataValues.p_price)

        let currentOrderItemBody = {
          o_id: currentOrder.dataValues.o_id,
          p_id: element.product_id,
          price: currentProduct.dataValues.p_price,
          product_discount: currentProduct.dataValues.discount,
          product_unit: currentProduct.dataValues.unit_in_case,
          cases: element.cases,
          piece: element.piece
        }

        const currentOrderItem = await req.config.dmsOrderItems.create(currentOrderItemBody, {transaction: process})
      }

      let updatedBody = {
        sub_total : total_cart_value
      }
      
      if(voucher_type){
        let discount = 0
        if(voucher_type === 'percent'){
          discount =  totalDiscount(total_cart_value, voucher_value)
        }else{
          discount = voucher_value
        }

        updatedBody.total_price = total_cart_value - discount
        updatedBody.voucher_type = voucher_type
        updatedBody.voucher_value = voucher_value

      }else{
        updatedBody.total_price = total_cart_value
      }

      await currentOrder.update(updatedBody,{transaction: process})
      await process.commit()
      return responseSuccess(req, res, "Order created Successfully");
  
    }else{
      await process.cleanup()
      return await responseError(req, res, "No item in the cart")
    }

    

   
    
  } catch (error) {
    logErrorToFile(error)
    console.log("error", error);
    await process.rollback();
    return responseError(req, res, "Order Creation Fail");
  }
};
exports.incrementCart = async (req, res) => {
  try {
    var { user_id, product_id, cases, piece=0 } = req.body;
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
      cart.piece += piece
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
      cart.cases -= cases;
      cart.piece -= piece;
      await cart.save();
    }
    const responseCart = await req.config.dmsCart.findOne({
      where: {
        product_id: product_id,
        user_id: user_id,
      },
    });

    if (cart && cart.cases <= 0 && cart.piece <= 0) {
      cart.destroy({ force: true });
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
