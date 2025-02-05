module.exports = (sequelize, DataTypes) => {
    const policyHead = sequelize.define(
    "db_policy_head", // database table name
    {
        policy_id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
  
        policy_name: {
            type: DataTypes.STRING(200),
            allowNull: false,
        },
        
        is_travel: {
          type: DataTypes.BOOLEAN,
          allowNull: true,
      },

       policy_code: {
            type: DataTypes.STRING(200),
            allowNull: false,
       }
        
    },
      { paranoid: true, timestamps: true }
    );
  
    return policyHead;
  };
  