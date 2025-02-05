module.exports = (sequelize, DataTypes) => {
    const SalesOrderModel = sequelize.define("db_sales_orders", // database table name
        {
            s_o_id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },

            s_o_code: {
                type: DataTypes.STRING,
                allowNull: true,
            },

            s_o_number: {
                type: DataTypes.STRING,
                allowNull: true,
            },

            s_o_date: {
                type: DataTypes.DATE,
                allowNull: true,
            },

            s_o_po_number: {
                type: DataTypes.STRING,
                allowNull: true,
            },

            s_o_po_date: {
                type: DataTypes.DATE,
                allowNull: true,
            },

            s_o_po_value: {
                type: DataTypes.INTEGER,
                allowNull: true,
            },

            campaign_name: {
                type: DataTypes.STRING,
                allowNull: true,
            },

            campaign_id: {
                type: DataTypes.INTEGER,
                allowNull: true,
                references: {
                    model: 'db_media_campaigns',
                    key: 'campaign_id',
                }
            },

            acc_id: {
                type: DataTypes.INTEGER,
                allowNull: true,
                references: {
                    model: "db_accounts",
                    key: "acc_id",
                },
            },

            estimate_id: {
                type: DataTypes.INTEGER,
                allowNull: true,
                references: {
                    model: 'db_estimates',
                    key: 'estimate_id',
                }
            },

            s_o_po_remarks: {
                type: DataTypes.TEXT,
                default: true,
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

            status: {
                type: DataTypes.BOOLEAN,
                default: true,
            },
        },
        { paranoid: true, timestamps: true },
    );


    return SalesOrderModel;
};

