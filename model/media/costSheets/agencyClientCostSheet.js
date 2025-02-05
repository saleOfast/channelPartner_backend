module.exports = (sequelize, DataTypes) => {
    const clientCostSheet = sequelize.define(
        "db_agency_client_cost_sheets", // database table name
        {
            ccs_id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            site_id: {           //agency Sites
                type: DataTypes.INTEGER,
                allowNull: true,
                references: {
                    model: "db_sites_agencies",
                    key: "site_id",
                },
            },
            estimate_id: {      //agency estiamtes
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
            selling_price_as_per_duration: {
                type: DataTypes.FLOAT,
                allowNull: true,
            },
            _client_po_cost: {
                type: DataTypes.FLOAT,
                allowNull: true,
            },
            mounting_cost_per_sq_ft: {
                type: DataTypes.FLOAT,
                allowNull: true,
                validate: {
                    min: 0,
                },
            },
            mounting_cost: {
                type: DataTypes.FLOAT,
                allowNull: true,
                validate: {
                    min: 0,
                },
            },
            printing_cost_per_sq_ft: {
                type: DataTypes.FLOAT,
                allowNull: true,
                validate: {
                    min: 0,
                },
            },
            printing_cost: {
                type: DataTypes.FLOAT,
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
            remarks: {
                type: DataTypes.STRING,
                allowNull: true,
            },
        },
        { paranoid: true, timestamps: true }
    );

    return clientCostSheet;
};
