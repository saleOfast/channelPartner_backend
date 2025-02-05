module.exports = (sequelize, DataTypes) => {
    const platform = sequelize.define("db_platform", // database table name
      {
        platform_id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },

        platform_name: {
            type: DataTypes.STRING,
            allowNull: true,
        },

        is_active: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
      },
      { paranoid: true, timestamps: true },   
    );
    
  
    return platform;
  };
  