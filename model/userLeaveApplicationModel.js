module.exports = (sequelize, DataTypes) => {
    const leaveApp = sequelize.define("db_leave_application", // database table name
      {
        leave_app_id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },

        report_to: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: 'db_users', 
                key: 'user_id', 
            }
        },

        submitted_by: {
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

        reason: {
            type: DataTypes.STRING,
            allowNull: true,
        },

        no_of_days : {
            type: DataTypes.INTEGER,
            allowNull: true,
        },

        from_date: {
            type: DataTypes.DATEONLY,
            allowNull: true,
        },

        to_date : {
            type: DataTypes.DATEONLY,
            allowNull: true,
        },

        leave_app_status: {
            type: DataTypes.ENUM('pending', 'approved', 'rejected'),
            defaultValue: 'pending',
            allowNull: true
        },

        remarks: {
            type: DataTypes.TEXT,
            allowNull: true,
        }

      },
      { paranoid: true, timestamps: true },   
    );
    
  
    return leaveApp;
  };
  