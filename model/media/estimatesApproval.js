module.exports = (sequelize, DataTypes) => {
    const estimationApprovals = sequelize.define("db_estimation_approvals", // database table name
        {
            es_ap_id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },

            role_id: {
                type: DataTypes.INTEGER,
                allowNull: true,
                references: {
                    model: 'db_roles',
                    key: 'role_id',
                }
            },

            site_type: {
                type: DataTypes.ENUM,
                values: ['ASSET', 'AGENCY'], // Define the possible enum values
                allowNull: true,
            },

            estimate_id: {
                type: DataTypes.INTEGER,
                allowNull: true,
                references: {
                    model: 'db_estimates',
                    key: 'estimate_id',
                }
            },

            responded: {
                type: DataTypes.BOOLEAN,
                default: true,
            },

            approval_status: {
                type: DataTypes.BOOLEAN,
                default: true,
            },

            approved_by: {
                type: DataTypes.INTEGER,
                allowNull: true,
                references: {
                    model: 'db_users',
                    key: 'user_id',
                }
            },

            approval_date: {
                type: DataTypes.DATE,
                default: true,
            },

            status: {
                type: DataTypes.BOOLEAN,
                default: true,
            },
        },
        { paranoid: true, timestamps: true },
    );


    return estimationApprovals;
};

