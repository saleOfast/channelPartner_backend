module.exports = (sequelize, DataTypes) => {
    const leadStatus = sequelize.define("db_lead_status", // database table name
      {
        lead_status_id: {
          type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },

        lead_status_code: {
          type: DataTypes.STRING,
            allowNull: true,
        },

        status_name: {
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
    
  
    return leadStatus;
  };
  