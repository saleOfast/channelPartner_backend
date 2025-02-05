module.exports = (sequelize, DataTypes) => {
    const loss = sequelize.define("db_loss", // database table name
      {
        loss_id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },

        loss_code: {
            type: DataTypes.STRING,
            allowNull: true,
        },

        loss_reason: {
            type: DataTypes.TEXT,
            allowNull: true,
        },

        status: {
            type: DataTypes.BOOLEAN,
            allowNull: true,
        },
      },
      { paranoid: true, timestamps: true },   
    );
    
  
    return loss;
  };
  