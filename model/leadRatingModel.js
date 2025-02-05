module.exports = (sequelize, DataTypes) => {
    const leadRating = sequelize.define("db_lead_rating", // database table name
      {
        lead_rate_id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },

        lead_rate_code: {
            type: DataTypes.STRING,
            allowNull: true,
        },

        rating: {
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
    
    return leadRating;
  };
  