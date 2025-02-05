module.exports = (sequelize, DataTypes) => {
    const Country = sequelize.define("db_currencies", // database table name
      {
        currency_id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        
        country_name: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        
        country_code: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        
        currency: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        
        code: {
            type: DataTypes.STRING,
            allowNull: true,
        },
      },
      { paranoid: true, timestamps: true },   
    );
    
  
    return Country;
  };
  