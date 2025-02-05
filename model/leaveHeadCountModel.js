module.exports = (sequelize, DataTypes) => {
    const leaveHeadCount = sequelize.define("db_head_leave_count", // database table name
      {
        head_leave_cnt_id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },

        head_leave_id: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: 'db_head_leaves', 
                key: 'head_leave_id', 
            } 
        },
  
        financial_start: {
            type: DataTypes.DATEONLY,
            allowNull: true,
        },

         
        financial_end: {
            type: DataTypes.DATEONLY,
            allowNull: true,
        },

        total_head_leave: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        status: {
            type: DataTypes.BOOLEAN,
            defaultValue: true
        },
      },
      { paranoid: true, timestamps: true },   
    );
    
  
    return leaveHeadCount;
  };
  