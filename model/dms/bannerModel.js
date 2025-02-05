module.exports = (sequelize, DataTypes) => {
    const dmsBanner = sequelize.define(
    "db_dms_banner", // database table name
    {
        banner_id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },

        banner_alt: {
            type: DataTypes.STRING(200),
            allowNull: true,
        },

        banner_image: {
            type: DataTypes.STRING(200),
            allowNull: true,
        },

        banner_link: {
            type: DataTypes.STRING,
            allowNull: true,
        },
   
        start_date: {
            type: DataTypes.DATEONLY,
            allowNull: true,
        },

        end_date: {
            type: DataTypes.DATEONLY,
            allowNull: true,
        },

        status: {
            type: DataTypes.BOOLEAN,
            defaultValue: true,
            allowNull: true,
        },


    },
      { paranoid: true, timestamps: true }
    );
  
    return dmsBanner;
  };
  