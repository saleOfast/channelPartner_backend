module.exports = (sequelize, DataTypes) => {
    const JobCard = sequelize.define("db_job_cards", // database table name
        {
            jc_id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },

            jc_code: {
                type: DataTypes.STRING,
                allowNull: true,
            },

            jc_request_date: {
                type: DataTypes.DATEONLY,
                allowNull: true,
            },

            acc_id: {
                type: DataTypes.INTEGER,
                allowNull: true,
                references: {
                    model: 'db_accounts',
                    key: 'acc_id',
                }
            },

            account_type_id: {
                type: DataTypes.INTEGER,
                allowNull: true,
                references: {
                    model: 'db_account_types',
                    key: 'account_type_id',
                }
            },

            jc_vendor_code: {
                type: DataTypes.STRING,
                allowNull: true,
            },

            jc_vendor_name: {
                type: DataTypes.STRING,
                allowNull: true,
            },

            printing_material: {
                type: DataTypes.STRING,
                allowNull: true,
            },

            estimate_id: {
                type: DataTypes.INTEGER,
                allowNull: true,
                references: {
                    model: "db_estimates",
                    key: "estimate_id",
                },
            },

            campaign_id: {
                type: DataTypes.INTEGER,
                allowNull: true,
                references: {
                    model: "db_media_campaigns",
                    key: "campaign_id",
                },
            },

            estimation_code: {
                type: DataTypes.STRING,
                allowNull: true,
            },

            campaign_code: {
                type: DataTypes.STRING,
                allowNull: true,
            },

            campaign_start_date: {
                type: DataTypes.DATE,
                allowNull: true,
            },

            campaign_end_date: {
                type: DataTypes.DATE,
                allowNull: true,
            },

            campaign_duration: {
                type: DataTypes.INTEGER,
                allowNull: true,
            },

            site_id_asset: {
                type: DataTypes.INTEGER,
                allowNull: true,
                references: {
                    model: "db_sites",
                    key: "site_id",
                },
            },

            site_id_agency: {
                type: DataTypes.INTEGER,
                allowNull: true,
                references: {
                    model: "db_sites_agencies",
                    key: "site_id",
                },
            },

            site_code: {
                type: DataTypes.STRING,
                allowNull: true,
            },

            site_state: {
                type: DataTypes.STRING,
                allowNull: true,
            },

            site_city: {
                type: DataTypes.STRING,
                allowNull: true,
            },

            site_location: {
                type: DataTypes.STRING,
                allowNull: true,
            },

            site_height: {
                type: DataTypes.INTEGER,
                allowNull: true,
            },

            site_width: {
                type: DataTypes.INTEGER,
                allowNull: true,
            },

            total_per_sq_ft: {
                type: DataTypes.INTEGER,
                allowNull: true,
            },

            cost_per_sq_ft: {
                type: DataTypes.INTEGER,
                allowNull: true,
            },

            site_quantity: {
                type: DataTypes.INTEGER,
                allowNull: true,
            },

            site_total_payout: {
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


    return JobCard;
};

