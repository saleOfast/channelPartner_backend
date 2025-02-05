module.exports = (sequelize, DataTypes) => {
    const vendorCostSheet = sequelize.define(
        "db_asset_vendor_cost_sheets", // database table name
        {
            vcs_id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            site_id: {           //asset Sites
                type: DataTypes.INTEGER,
                allowNull: true,
                references: {
                    model: "db_sites",
                    key: "site_id",
                },
            },
            eab_id: {      //asset estiamtes
                type: DataTypes.INTEGER,
                allowNull: true,
                references: {
                    model: "db_estimation_asset_businesses",
                    key: "eab_id",
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
            mounting_vendor_id: {
                type: DataTypes.INTEGER,
                allowNull: true,
                references: {
                    model: "db_accounts",
                    key: "acc_id",
                },
            },
            mounting_cost_per_sq_ft: {
                type: DataTypes.FLOAT,
                allowNull: true,
            },
            printing_vendor_id: {
                type: DataTypes.INTEGER,
                allowNull: true,
                references: {
                    model: "db_accounts",
                    key: "acc_id",
                },
            },
            display_vendor_id: {
                type: DataTypes.INTEGER,
                allowNull: true,
                references: {
                    model: "db_accounts",
                    key: "acc_id",
                },
            },
            pr_m_id: {
                type: DataTypes.INTEGER,
                allowNull: true,
                references: {
                    model: "db_printing_materials",
                    key: "pr_m_id",
                },
            },
            state: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            city: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            location: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            category: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            media_format: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            media_vehicle: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            media_type: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            quantity: {
                type: DataTypes.FLOAT,
                allowNull: true,
                validate: {
                    min: 0,
                },
            },
            width: {
                type: DataTypes.FLOAT,
                allowNull: true,
                validate: {
                    min: 0,
                },
            },
            height: {
                type: DataTypes.FLOAT,
                allowNull: true,
                validate: {
                    min: 0,
                },
            },
            total_sq_ft: {
                type: DataTypes.FLOAT,
                allowNull: true,
            },
            campaign_start_date: {
                type: DataTypes.DATE,
                allowNull: true,
                validate: {
                    isDate: true,
                },
            },
            campaign_end_date: {
                type: DataTypes.DATE,
                allowNull: true,
            },
            campaign_duration: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            display_cost_per_month: {
                type: DataTypes.FLOAT,
                allowNull: true,
            },
            buying_price_as_per_duration: {
                type: DataTypes.FLOAT,
                allowNull: true,
            },
            mounting_cost_per_sq_ft: {
                type: DataTypes.FLOAT,
                allowNull: true,
            },
            mounting_cost: {
                type: DataTypes.FLOAT,
                allowNull: true,
            },
            printing_cost_per_sq_ft: {
                type: DataTypes.FLOAT,
                allowNull: true,
            },
            printing_cost: {
                type: DataTypes.FLOAT,
                allowNull: true,
            },
            final_display_cost: {
                type: DataTypes.FLOAT,
                allowNull: true,
            },
            remarks: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            created_by: {
                type: DataTypes.INTEGER,
                allowNull: true,
                references: {
                    model: 'db_users',
                    key: 'user_id',
                }
            },
            last_updated_by: {
                type: DataTypes.INTEGER,
                allowNull: true,
                references: {
                    model: 'db_users',
                    key: 'user_id',
                }
            },
        },
        { paranoid: true, timestamps: true }
    );

    return vendorCostSheet;
};
