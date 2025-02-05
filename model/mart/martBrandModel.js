const { Sequelize, DataTypes } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    const martBrandMaster = sequelize.define(
    "db_mart_brand_master", // database table name
    {
        brand_id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
   
        name: {
            type: DataTypes.STRING,
            allowNull: true,
        },
       
        user_id: {
			type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: 'db_users', 
                key: 'user_id', 
            }
		},
        
    },
      { paranoid: true, timestamps: true }
    );
  
    return martBrandMaster;
  };
  