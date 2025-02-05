module.exports = (sequelize, DataTypes) => {
    const cpt = sequelize.define(
    "db_channel_partner_types", // database table name
    {
        cpt_id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
  
        name: {
            type: DataTypes.STRING(200),
            allowNull: true,
        },
    },
      { paranoid: true, timestamps: true }
    );
  
    return cpt;
  };