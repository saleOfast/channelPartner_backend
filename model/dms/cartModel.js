module.exports = (sequelize, DataTypes) => {
  const Cart = sequelize.define(
    "db_dms_carts",
    {
      cart_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "db_users",
          key: "user_id",
        },
      },
      product_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "db_products",
          key: "p_id",
        },
      },
      cases: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      piece: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
    },
    { paranoid: true, timestamps: true }
  );

  return Cart;
};
