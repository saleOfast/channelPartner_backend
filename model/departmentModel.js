module.exports = (sequelize, DataTypes) => {
    const department = sequelize.define("db_department", // database table name
      {
        dep_id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },

        department_code: {
            type: DataTypes.STRING,
            allowNull: true,
        },

        department: {
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
    
  
    return department;
  };
  