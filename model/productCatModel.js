module.exports = (sequelize, DataTypes) => {
    const productCategories = sequelize.define("db_p_cat", // database table name
      {
        p_cat_id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },

        p_cat_code: {
            type: DataTypes.STRING,
            allowNull: true,
        },

        p_cat_name: {
            type: DataTypes.STRING,
            allowNull: true,
        },

        parent_id: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        },

        parent_name: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        image: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        status: {
            type: DataTypes.BOOLEAN,
            allowNull: true,
        },
      },
      { paranoid: true, timestamps: true },   
    );
    
  
    return productCategories;
  };
  