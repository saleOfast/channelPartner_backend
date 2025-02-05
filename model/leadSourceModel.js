module.exports = (sequelize, DataTypes) => {
    const leadSrc = sequelize.define("db_lead_source", // database table name
      {
        lead_src_id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },

        lead_src_code: {
            type: DataTypes.STRING,
            allowNull: true,
        },

        source: {
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
    
  
    return leadSrc;
  };
  