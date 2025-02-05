module.exports = (sequelize, DataTypes) => {
  const LoginLogger = sequelize.define("db_loginLogs", // database table name
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      db_name: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      login_time: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      IP_address: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      role_id: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    },
    {
      timestamps: true,
      paranoid: true,
    },
  );

  return LoginLogger;
};
