module.exports = (sequelize, DataTypes) => {
    const clientPlatform = sequelize.define("db_user_platform", // database table name
      {
        u_p_id: {
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

        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'db_users', 
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
  