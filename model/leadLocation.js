module.exports = (sequelize, DataTypes) => {
    const leadLocation = sequelize.define("db_lead_location", // database table name
      {
        lead_loaction_id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        
        name: {
            type: DataTypes.STRING,
            allowNull: true,
        },
      },
      { paranoid: true, timestamps: true },   
    );
    
  return leadLocation;
};