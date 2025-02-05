module.exports = (sequelize, DataTypes) => {
    const Settings = sequelize.define(
        "db_general_settings", // database table name
        {
            setting_id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },

            setting_name: {
                type: DataTypes.STRING(200),
                allowNull: false,
            },

            setting_value: {
                type: DataTypes.TEXT,
                allowNull: false,
            },

        },
        { paranoid: true, timestamps: true }
    );

    return Settings;
};