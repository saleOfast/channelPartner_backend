module.exports = (sequelize, DataTypes) => {
    const dmsBrand = sequelize.define(
    "db_dms_brand", // database table name
    {
        brand_id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },   
        brand_name: {
            type: DataTypes.STRING(200),
            allowNull: false,
        },

        brand_image: {
            type: DataTypes.STRING(200),
            allowNull: true,
        },


    },
      { paranoid: true, timestamps: true }
    );
  
    return dmsBrand;
  };
  