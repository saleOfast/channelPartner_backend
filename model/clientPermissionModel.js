module.exports = (sequelize, DataTypes) => {
    const clientPermisiion = sequelize.define(
    "db_client_permission", // database table name
    {
        permission_id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },

        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'db_clients', 
                key: 'user_id', 
            }
        },
        
        menu_id:{
            type: DataTypes.INTEGER,    
            allowNull: false,
            references: {
                model: 'db_menus', 
                key: 'menu_id', 
            }
        },

        actions:{
            type: DataTypes.BOOLEAN,
            allowNull: true,
        },
    },
      { paranoid: true, timestamps: true }
    );
  
    return clientPermisiion;
  };
  