const { Sequelize, DataTypes } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    const quationTax = sequelize.define(
    "db_quation_tax", // database table name
    {
        quat_tax_id: {
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

        tax_name: {
            type: DataTypes.STRING,
            allowNull: true,
        },

        tax_percentage: {
            type: DataTypes.FLOAT,
            allowNull: true,
        },

        amt: {
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
  
    return quationTax;
  };
  