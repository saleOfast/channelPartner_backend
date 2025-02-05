module.exports = (sequelize, DataTypes) => {
    const headLeave = sequelize.define("db_head_leave", // database table name
      {
        head_leave_id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },

        head_leave_code: {
            type: DataTypes.STRING,
            allowNull: true,
        },

        head_leave_short_name: {
            type: DataTypes.STRING,
            allowNull: true,
        },

        head_leave_name: {
            type: DataTypes.STRING,
            allowNull: true,
        },

        status: {
            type: DataTypes.BOOLEAN,
            defaultValue: true
        },
      },
      { paranoid: true, timestamps: true },   
    );
    
  
    return headLeave;
  };
  