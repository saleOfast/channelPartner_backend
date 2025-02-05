module.exports = (sequelize, DataTypes) => {
    const division = sequelize.define("db_division", // database table name
      {
        div_id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },

        divison_code: {
            type: DataTypes.STRING,
            allowNull: true,
        },

        divison: {
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
    
  
    return division;
  };
  