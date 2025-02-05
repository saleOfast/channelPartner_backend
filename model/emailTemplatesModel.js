module.exports = (sequelize, DataTypes) => {
    const EmailTemplate = sequelize.define(
        "db_email_templates", // database table name
        {
            template_id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },

            template_name: {
                type: DataTypes.STRING,
                allowNull: false,
            },

            template: {
                type: DataTypes.TEXT,
                allowNull: false,
            },

            platform_id: {
                type: DataTypes.INTEGER,
                allowNull: true,
                references: {
                    model: 'db_platforms',
                    key: 'platform_id',
                },
                onUpdate: 'NO ACTION',
                onDelete: 'SET NULL',
            },

        },
        { paranoid: true, timestamps: true }
    );

    return EmailTemplate;
};
