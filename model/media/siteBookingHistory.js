module.exports = (sequelize, DataTypes) => {
    const siteBooking = sequelize.define("db_site_booking_history_asset", // These table is only for sites made in our CRM
        {
            sb_id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },

            sb_code: {
                type: DataTypes.STRING,
                allowNull: true,
            },

            site_id: {
                type: DataTypes.INTEGER,
                allowNull: true,
                references: {
                    model: 'db_sites',
                    key: 'site_id',
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

            estimate_id: {
                type: DataTypes.INTEGER,
                allowNull: true,
                references: {
                    model: 'db_estimates',
                    key: 'estimate_id',
                }
            },

            ccs_id: {
                type: DataTypes.INTEGER,
                allowNull: true,
                references: {
                    model: 'db_asset_client_cost_sheets',
                    key: 'ccs_id',
                }
            },

            vcs_id: {
                type: DataTypes.INTEGER,
                allowNull: true,
                references: {
                    model: 'db_asset_vendor_cost_sheets',
                    key: 'vcs_id',
                }
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


    return siteBooking;
};

