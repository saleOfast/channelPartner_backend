const { Sequelize, DataTypes } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    const quationProduct = sequelize.define(
    "db_quation_product", // database table name
    {
        quat_product_id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
   
        quat_mast_id:{
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: 'db_quation_masters', 
                key: 'quat_mast_id', 
            }
        },

        p_id:{
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: 'db_products', 
                key: 'p_id', 
            }
        },

        qty: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },

        price: {
            type: DataTypes.FLOAT,
            allowNull: true,
        },

        product_discount: {
            type: DataTypes.FLOAT,
            allowNull: true,
        },

        product_amount: {
            type: DataTypes.FLOAT,
            allowNull: true,
        },

        effective_date: {
            type: DataTypes.DATE,
            allowNull: true,
        },
    },
      { paranoid: true, timestamps: true }
    );
  
    return quationProduct;
  };
  