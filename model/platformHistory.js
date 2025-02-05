const { Sequelize, DataTypes } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    const platformHistory = sequelize.define("db_platform_history", // database table name
    {
        platformHistory_id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
      
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'db_clients', 
                key: 'user_id', 
            }
        },

        platform_id:{
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: 'db_platforms', 
                key: 'platform_id', 
            }
        },
        
        platformHistory_count: {
            type: DataTypes.INTEGER(11),
            allowNull: true
        },

        updated_by: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'db_supers', 
                key: 'user_id', 
            }
        },

       
      },
      { paranoid: true, timestamps: true },   
    );
    
  
    return platformHistory;
  };
  
