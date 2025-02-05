module.exports = (sequelize, DataTypes) => {
    const userPermisiion = sequelize.define(
    "db_role_permission", // database table name
    {
        permission_id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
  
        role_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'db_roles', 
                key: 'role_id', 
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
  
    return userPermisiion;
  };
  