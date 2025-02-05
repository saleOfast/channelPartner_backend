module.exports = (sequelize, DataTypes) => {
    const Field = sequelize.define(
    "db_field", // database table name
    {
        field_id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },

        navigate_type: {
            type: DataTypes.ENUM('lead', 'contact', 'accounts', 'user', 'quotation', 'opportunity', 'task', 'event'),
            allowNull: true,
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
  
    return Field;
  };
  