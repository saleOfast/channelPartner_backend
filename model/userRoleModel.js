module.exports = (sequelize, DataTypes) => {
    const Role = sequelize.define(
        "db_role", // database table name
        {
            role_id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },

            role_name: {
                type: DataTypes.STRING(200),
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
                onDelete: 'SET NULL', // Will set platform_id to null on delete
            },
        },
        { paranoid: true, timestamps: true }
    );

    return Role;
};
