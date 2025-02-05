module.exports=(sequelize, DataTypes)=>{
    const emailConfig = sequelize.define(
        "db_email_config",
        {
            email_config_id:{
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
              host: {
                type: DataTypes.STRING,
                allowNull: true,
              },
              port: {
                type: DataTypes.INTEGER,
                allowNull: true,
              },
              user: {
                type: DataTypes.STRING,
                allowNull: true,
              },
              password: {
                type: DataTypes.STRING,
                allowNull: true,
              },
              from: {
                type: DataTypes.STRING,
                allowNull: true,
              },
        },
        { paranoid: true, timestamps: true }
    )
    return emailConfig;
}