module.exports = (sequelize, DataTypes) => {
    const Expensedoc = sequelize.define(
    "db_expence_doc", // database table name
    {
        expence_doc_id: {
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
        expence_id: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: 'db_expences', 
                key: 'expence_id', 
            }
        },

        support_doc: {
            type: DataTypes.STRING,
            allowNull: true,
        },

    },
      { paranoid: true, timestamps: true }
    );
  
    return Expensedoc;
  };
  