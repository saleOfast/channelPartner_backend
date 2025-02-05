module.exports = (sequelize, DataTypes) => {
    const City = sequelize.define(
    "db_city", // database table name
    {
        city_id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
  
        city_name: {
            type: DataTypes.STRING(200),
            allowNull: false,
        },
        
        state_id:{
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'db_states', 
                key: 'state_id', 
            }
        },
       
    },
      { paranoid: true, timestamps: true }
    );
  
    return City;
  };
  