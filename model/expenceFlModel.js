const { Sequelize, DataTypes } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    const expence_fl = sequelize.define("db_expence_fl", // database table name
    {
        expence_doc_id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
      
        expence_by: {
            type: DataTypes.INTEGER,
			allowNull: true,
			references: {
				model: 'db_expences', 
				key: 'expence_id', 
			}
        },

        expence_fl: {
            type: DataTypes.STRING,
			allowNull: true,
        },
      },
      { paranoid: true, timestamps: true },   
    );
    
  
    return expence_fl;
  };
  
