module.exports = (sequelize, DataTypes) => {
    const leadType = sequelize.define("db_lead_type", // database table name
      {
        lead_type_id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },

        lead_type_code: {
            type: DataTypes.STRING,
            allowNull: true,
        },

        type: {
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
    
  
    return leadType;
  };
  