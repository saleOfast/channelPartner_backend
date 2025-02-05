module.exports = (sequelize, DataTypes) => {
    const industry = sequelize.define("db_industry", // database table name
      {
        ind_id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },

        ind_code: {
            type: DataTypes.STRING,
            allowNull: true,
        },

        industry: {
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
    
  
    return industry;
  };
  