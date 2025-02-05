module.exports = (sequelize, DataTypes) => {
    const leadStatus = sequelize.define("db_lead_status", // database table name
      {
        lead_status_id: {
            status: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },

        lead_status_code: {
            status: DataTypes.STRING,
            allowNull: true,
        },

        status: {
            status: DataTypes.STRING,
            allowNull: true,
        },

        status: {
            status: DataTypes.BOOLEAN,
            allowNull: true,
        },
      },
      { paranoid: true, timestamps: true },   
    );
    
  
    return leadStatus;
  };
  