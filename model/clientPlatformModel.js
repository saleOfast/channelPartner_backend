module.exports = (sequelize, DataTypes) => {
    const clientPlatform = sequelize.define("db_client_platform", // database table name
      {
        c_p_id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },

        platform_id:{
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: 'db_platforms', 
                key: 'platform_id', 
            }
        },

        client_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'db_clients', 
                key: 'user_id', 
            }
        },

        actions:{
            type: DataTypes.BOOLEAN,
            allowNull: true,
        },
      },
      { paranoid: true, timestamps: true },   
    );
    
  
    return clientPlatform;
  };
  