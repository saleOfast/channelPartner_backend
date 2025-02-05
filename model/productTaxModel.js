const { Sequelize, DataTypes } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    const productTax = sequelize.define(
    "db_product_tax", // database table name
    {
        product_tax_id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
  
        effective_date: {
            type: DataTypes.DATE,
            allowNull: true,
        },
        
        p_id:{
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: 'db_products', 
                key: 'p_id', 
            }
        },
        tax_id:{
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'db_taxes', 
                key: 'tax_id', 
            }
        },
    },
      { paranoid: true, timestamps: true }
    );
  
    return productTax;
  };
  