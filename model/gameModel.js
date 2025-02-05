module.exports = (sequelize, DataTypes) => {
    const game = sequelize.define("db_game", // database table name
      {
        game_id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        game_name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
      },
      { paranoid: true, timestamps: true },   
    );
    
  
    return game;
  };
  