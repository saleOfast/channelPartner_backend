module.exports = (sequelize, DataTypes) => {
    const opprStage = sequelize.define("db_opportunity_stg", // database table name
      {
        opportunity_stg_id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },

        opportunity_stg_code: {
            type: DataTypes.STRING,
            allowNull: true,
        },

        opportunity_stg_name: {
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
    
  
    return opprStage;
  };
  