module.exports = (sequelize, DataTypes) => {
    const Expence = sequelize.define(
    "db_expence", // database table name
    {
        expence_id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },

        claim_type: {
            type: DataTypes.ENUM('TA', 'DA'),
            allowNull: true
        },

        from_date: {
            type: DataTypes.DATE,
            allowNull: true,
        },

        to_date : {
            type: DataTypes.DATE,
            allowNull: true,
        },


        policy_id : {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: 'db_policy_heads', 
                key: 'policy_id', 
            }
        },

        policy_type_id : {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: 'db_policy_type_heads', 
                key: 'policy_type_id', 
            }
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

        from_location :{
            type: DataTypes.STRING,
            allowNull: true,
        },
   
        to_location :{
            type: DataTypes.STRING,
            allowNull: true,
        },

        kms: {
            type: DataTypes.FLOAT,
            allowNull: true,
        },

        total_expence :{
            type: DataTypes.FLOAT,
            allowNull: true,
        },

        detail : {
            type: DataTypes.TEXT,
            allowNull: true,
        },

        remark : {
            type: DataTypes.STRING,
            allowNull: true,
        },

        status: {
            type: DataTypes.ENUM('pending', 'approved', 'rejected'),
            defaultValue: 'pending',
            allowNull: true
        },

    },
      { paranoid: true, timestamps: true }
    );
  
    return Expence;
  };
  