module.exports = (sequelize, DataTypes) => {
  const taskStatus = sequelize.define("db_task_status", // database table name
    {
      task_status_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },

      task_status_code: {
        type: DataTypes.STRING,
        allowNull: true,
      },

      task_status_name: {
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


  return taskStatus;
};

