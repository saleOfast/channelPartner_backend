module.exports = (sequelize, DataTypes) => {
    const designation = sequelize.define("db_designation", // database table name
      {
        des_id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },

        designation_code: {
            type: DataTypes.STRING,
            allowNull: true,
        },

        designation: {
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
    
  
    return designation;
  };
  