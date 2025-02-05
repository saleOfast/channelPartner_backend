module.exports = (sequelize, DataTypes) => {
    const userAttendance = sequelize.define("db_user_attend", // database table name
      {
        user_attnd_id: {
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

        check_in : {
            type: DataTypes.DATE,
            allowNull: true,
        },

        check_out : {
            type: DataTypes.DATE,
            allowNull: true,
        },

        lat : {
            type: DataTypes.STRING,
            allowNull: true,
        },

        lon : {
            type: DataTypes.STRING,
            allowNull: true,
        }
      },
      { paranoid: true, timestamps: true },   
    );
    
  
    return userAttendance;
  };
  