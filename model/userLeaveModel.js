module.exports = (sequelize, DataTypes) => {
    const userLeave = sequelize.define("db_user_leave", // database table name
      {
        user_leave_id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },

        user_id: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: 'db_users', 
                key: 'user_id', 
            }
        },

        head_leave_id:{
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: 'db_head_leaves', 
                key: 'head_leave_id', 
            }
        },

        head_leave_cnt_id:{
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: 'db_head_leave_counts', 
                key: 'head_leave_cnt_id', 
            }
        },

        left_leave: {
            type: DataTypes.INTEGER ,
            allowNull: true,
        },

        extra_leaves: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        remarks: {
            type: DataTypes.TEXT,
            allowNull: true,
        }
      },
      { paranoid: true, timestamps: true },   
    );
    
  
    return userLeave;
  };
  