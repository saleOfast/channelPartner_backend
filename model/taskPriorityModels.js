module.exports = (sequelize, DataTypes) => {
    const taskPriority = sequelize.define("db_task_priority", // database table name
      {
        task_priority_id: {
          type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },

        task_priority_code: {
          type: DataTypes.STRING,
            allowNull: true,
        },

        task_priority_name: {
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
    
  
    return taskPriority;
  };
  
  