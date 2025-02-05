module.exports = (sequelize, DataTypes) => {
    const Email = sequelize.define(
    "db_email", // database table name
    {
        e_id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
  
        name: {
            type: DataTypes.STRING(200),
            allowNull: true,
        },
        
        email: {
            type: DataTypes.STRING(200),
            allowNull: true,
        },
        
    
    },
      { paranoid: true, timestamps: true }
    );
  
    return Email;
  };