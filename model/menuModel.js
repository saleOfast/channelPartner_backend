module.exports = (sequelize, DataTypes) => {
    const Menu = sequelize.define(
    "db_menu", // database table name
    {
        menu_id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
  
        menu_name: {
            type: DataTypes.STRING(200),
            allowNull: false,
        },

        parent_id: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
        },

        menu_order: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },

        is_active: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        
        link: {
            type: DataTypes.STRING(100),
            allowNull: true,    
        },

        is_task: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },

        icon_path: {
            type: DataTypes.STRING(100),
            allowNull: true,    
        },

        allais_menu: {
            type: DataTypes.STRING(255),
            allowNull: true,    
        },

        menu_type: {
            type: DataTypes.ENUM('CRM', 'SALES', 'DMS', 'CHANNEL', 'MEDIA'),
            defaultValue: 'CRM',
            allowNull: true,    
        },
        
    },
      { paranoid: true, timestamps: true }
    );
  
    return Menu;
  };
  