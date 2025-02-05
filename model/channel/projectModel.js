module.exports = (sequelize, DataTypes) => {
    const project = sequelize.define("db_channel_project", // database table name
      {
        project_id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },

        project: {
            type: DataTypes.STRING,
            allowNull: true,
        },

        location: {
          type: DataTypes.STRING,
          allowNull: true,
        },

        property_size: {
          type: DataTypes.STRING,
          allowNull: true,
        },

        unit_area: {
          type: DataTypes.STRING,
          allowNull: true,
        },

        price: {
          type: DataTypes.STRING,
          allowNull: true,
        },

        contact_no: {
          type: DataTypes.BIGINT,
          allowNull: true,
        },

        cover_image: {
          type: DataTypes.STRING,
          allowNull: true,
        },

        logo_image: {
          type: DataTypes.STRING,
          allowNull: true,
        },

        html_file: {
          type: DataTypes.STRING,
          allowNull: true,
        },

        status: {
            type: DataTypes.BOOLEAN,
            allowNull: true,
        },

        created_by: {
          type: DataTypes.INTEGER,
          allowNull: true,
          references: {
              model: 'db_users', 
              key: 'user_id', 
          }
        },
      },
      { paranoid: true, timestamps: true },   
    );
    
  
    return project;
  };
  