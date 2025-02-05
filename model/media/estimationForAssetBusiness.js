module.exports = (sequelize, DataTypes) => {
    const estimationAssetBusiness = sequelize.define("db_estimation_asset_businesses", // database table name
        {
            eab_id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },

            site_id: {
                type: DataTypes.INTEGER,
                allowNull: true,
                references: {
                    model: 'db_sites',
                    key: 'site_id',
                }
            },

            estimate_id: {
                type: DataTypes.INTEGER,
                allowNull: true,
                references: {
                    model: 'db_estimates',
                    key: 'estimate_id',
                }
            },

            approval_status: {      //no use now since added approvals on estimate
                type: DataTypes.ENUM,
                values: ['APPROVED', 'PENDING', 'NEGOTIATING', 'NEGOTIATION COMPLETED', 'REJECTED'], // Define the possible enum values
                defaultValue: 'NEGOTIATING', // Set a default value if needed
            },

            start_date: {
                type: DataTypes.DATEONLY,
                allowNull: true,
            },

            end_date: {
                type: DataTypes.DATEONLY,
                allowNull: true,
            },

            duration: {
                type: DataTypes.INTEGER,
                allowNull: true,
            },

            status: {
                type: DataTypes.BOOLEAN,
                default: true,
            },
        },
        { paranoid: true, timestamps: true },
    );


    return estimationAssetBusiness;
};

