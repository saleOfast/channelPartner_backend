module.exports = (sequelize, DataTypes) => {
    const policyTypeHead = sequelize.define(
    "db_policy_type_head", // database table name
    {
        policy_type_id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        policy_type_name: {
            type: DataTypes.STRING,
            allowNull: true,
        },
  
        policy_id: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: 'db_policy_heads', 
                key: 'policy_id', 
            }
        },
        
        from_date: {
            type: DataTypes.DATE,
            allowNull: true,
        },

        to_date : {
            type: DataTypes.DATE,
            allowNull: true,
        },

        claim_type: {
            type: DataTypes.ENUM('TA', 'DA'),
            allowNull: true
        },

        cost_per_km :{
            type: DataTypes.FLOAT,
            allowNull: true,
        },
        
    },
      { paranoid: true, timestamps: true }
    );
  
    return policyTypeHead;
  };
  