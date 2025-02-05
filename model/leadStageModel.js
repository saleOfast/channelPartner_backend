module.exports = (sequelize, DataTypes) => {
    const leadStg = sequelize.define("db_lead_stage", // database table name
      {
        lead_stg_id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },

        lead_stg_code: {
            type: DataTypes.STRING,
            allowNull: true,
        },

        stage: {
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
    
  
    return leadStg;
  };
  