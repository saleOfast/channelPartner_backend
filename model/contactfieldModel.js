module.exports = (sequelize, DataTypes) => {
    const contactFieldData = sequelize.define(
    "db_contact_field", // database table name
    {
        contact_field_id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },

        contact_id:{
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: 'db_contacts', 
                key: 'contact_id', 
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
  
    return contactFieldData;
  };
  
