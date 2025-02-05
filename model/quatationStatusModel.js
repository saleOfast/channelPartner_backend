module.exports = (sequelize, DataTypes) => {
    const quatStatus = sequelize.define("db_quat_status", // database table name
      {
        quat_status_id: {
          type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },

        quat_status_code: {
          type: DataTypes.STRING,
            allowNull: true,
        },

        quat_status_name: {
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
    
  
    return quatStatus;
  };
  
  