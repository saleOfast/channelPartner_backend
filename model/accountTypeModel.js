module.exports = (sequelize, DataTypes) => {
  const accountType = sequelize.define("db_account_type", // database table name
    {
      account_type_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },

      account_type_code: {
        type: DataTypes.STRING,
        allowNull: true,
      },

      account_type_name: {
        type: DataTypes.STRING,
        allowNull: true,
      },

      status: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
      },
      platform_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: 'db_platforms', 
          key: 'platform_id', 
        }
      },
    },
    { paranoid: true, timestamps: true },
  );


  return accountType;
};
