module.exports = (sequelize, DataTypes) => {
    const userFieldData = sequelize.define(
    "db_user_fields", // database table name
    {
        user_field_id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },

        user: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
              model: 'db_users', // 'db_opportunity' refers to table name
              key: 'user_id', // 'opp_id' refers to column name in db_opportunity table
              onDelete: 'CASCADE',
              onUpdate: 'CASCADE' // No action on update
            }
          },

        field_lable: {
            type: DataTypes.STRING(200),
            allowNull: true,
        },

        field_name: {
            type: DataTypes.STRING(100),
            allowNull: true,
        },

        field_order: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        
        option:{
            type: DataTypes.STRING(250),
            allowNull: true,
        },

        input_value: {
            type: DataTypes.TEXT,
            allowNull: true,
        },

        input_type:{
            type: DataTypes.STRING(50),
            allowNull: true,
        },

        field_type:{
            type: DataTypes.STRING(50),
            allowNull: true,
        },

        field_size:{
            type: DataTypes.INTEGER,
            allowNull: true,
        },

    },
      { paranoid: true, timestamps: true }
    );
    
    return userFieldData;
  };
  
