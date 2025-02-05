module.exports = (sequelize, DataTypes) => {
    const Country = sequelize.define(
    "db_country", // database table name
    {
        country_id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        country_code: {
            type: DataTypes.STRING(200),
            allowNull: false,
        },
  
        country_name: {
            type: DataTypes.STRING(200),
            allowNull: false,
        },

        code:{
            type: DataTypes.INTEGER,
            allowNull: true,
        }

    },
      { paranoid: true, timestamps: true }
    );
  
    return Country;
  };
  