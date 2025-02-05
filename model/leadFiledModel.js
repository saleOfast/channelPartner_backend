module.exports = (sequelize, DataTypes) => {
    const leadFieldData = sequelize.define(
    "db_lead_field", // database table name
    {
        lead_field_id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },

        lead:{
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'db_leads', 
                key: 'lead_id', 
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
  
    return leadFieldData;
  };
  
