module.exports = (sequelize, DataTypes) => {
    const opprType = sequelize.define("db_opportunity_type", // database table name
      {
        opportunity_type_id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },

        opportunity_type_code: {
            type: DataTypes.STRING,
            allowNull: true,
        },

        opportunity_type_name: {
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
    
  
    return opprType;
  };
  