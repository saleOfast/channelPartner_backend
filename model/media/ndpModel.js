module.exports = (sequelize, DataTypes) => {
    const ndp = sequelize.define("db_ndps", // database table name
        {
            ndp_id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },

            ndp_code: {
                type: DataTypes.STRING,
                allowNull: true,
            },

            ndp_reported_date: {
                type: DataTypes.DATEONLY,
                allowNull: true,
            },

            ndp_start_date: {
                type: DataTypes.DATEONLY,
                allowNull: true,
            },

            ndp_end_date: {
                type: DataTypes.DATEONLY,
                allowNull: true,
            },

            ndp_duration: {
                type: DataTypes.DATEONLY,
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

            ndp_r_id: {
                type: DataTypes.INTEGER,
                allowNull: true,
                references: {
                    model: 'db_ndp_reasons',
                    key: 'ndp_r_id',
                }
            },

            campaign_id: {
                type: DataTypes.INTEGER,
                allowNull: true,
                references: {
                    model: 'db_media_campaigns',
                    key: 'campaign_id',
                }
            },

            site_id: {
                type: DataTypes.INTEGER,
                allowNull: true,
                references: {
                    model: 'db_sites',
                    key: 'site_id',
                }
            },

            remarks: {
                type: DataTypes.STRING,
                default: true,
            },

            amount: {
                type: DataTypes.INTEGER,
                default: true,
            },

            cd_approval: {
                type: DataTypes.BOOLEAN,
                allowNull: true,
            },

            cd_response: {
                type: DataTypes.BOOLEAN,
                allowNull: true,
            },

            status: {
                type: DataTypes.BOOLEAN,
                default: true,
            },
        },
        { paranoid: true, timestamps: true },
    );


    return ndp;
};

