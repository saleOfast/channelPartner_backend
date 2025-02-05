module.exports = (sequelize, DataTypes) => {
    const District = sequelize.define(
    "db_district", // database table name
    {
        district_id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
  
        district_name: {
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
  
    return District;
  };