// models/ChangeLog.js
module.exports = (sequelize, DataTypes) => {
    const ChangeLog = sequelize.define("db_asset_cost_sheet_change_logs", // Model name
        {
            ccs_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: 'db_asset_client_cost_sheets', // Reference to the original cost sheet model
                    key: 'ccs_id'
                }
            },
            differences: {
                type: DataTypes.STRING, // Use JSONB for storing the difference object
                allowNull: false,
            },
            changed_by: {
                type: DataTypes.INTEGER,
                allowNull: false
            },
            changed_at: {
                type: DataTypes.DATE,
                defaultValue: DataTypes.NOW
            }
        },
        {
            paranoid: true, // Enable soft deletes
            timestamps: true // Enable createdAt and updatedAt
        }
    );

    return ChangeLog;
};
