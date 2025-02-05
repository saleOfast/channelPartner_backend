module.exports = (sequelize, DataTypes) => {
    const Estimate = sequelize.define("db_estimates", // database table name
        {
            estimate_id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },

            estimate_date: {
                type: DataTypes.DATE,
                defaultValue: DataTypes.NOW,
            },

            estimate_type: {
                type: DataTypes.STRING,
                defaultValue: "Original",
            },

            estimation_code: {
                type: DataTypes.STRING,
                allowNull: true
            },

            sales_order_pdf: {
                type: DataTypes.STRING,
                allowNull: true,
            },

            campaign_id: {
                type: DataTypes.INTEGER,
                allowNull: true,
                references: {
                    model: 'db_media_campaigns',
                    key: 'campaign_id',
                },
                onDelete: 'SET NULL',
                onUpdate: 'NO ACTION'
            },

            package_offer: {
                type: DataTypes.ENUM('Yes', 'No'),
                defaultValue: 'Yes',
                allowNull: true,
            },

            package_cost_display: {
                type: DataTypes.FLOAT,
                allowNull: true,
            },

            package_cost_mounting: {
                type: DataTypes.FLOAT,
                allowNull: true,
            },

            package_cost_printing: {
                type: DataTypes.FLOAT,
                allowNull: true,
            },

            submitted_date: {
                type: DataTypes.DATE,
                allowNull: true,
            },

            approval_status: {
                type: DataTypes.ENUM,
                values: ['APPROVED', 'PENDING', 'NEGOTIATING', 'NEGOTIATION COMPLETED', 'REJECTED'], // Define the possible enum values
                defaultValue: 'NEGOTIATING', // Set a default value if needed
            },

            est_s_id: {
                type: DataTypes.INTEGER,
                allowNull: true,
                references: {
                    model: 'db_estimate_statuses',
                    key: 'est_s_id',
                },
                onDelete: 'SET NULL',
                onUpdate: 'NO ACTION'
            },

            est_t_id: {
                type: DataTypes.INTEGER,
                allowNull: true,
                references: {
                    model: 'db_estimation_types',
                    key: 'est_t_id',
                },
                onDelete: 'SET NULL',
                onUpdate: 'NO ACTION'
            },

            approved_date: {
                type: DataTypes.DATE,
                allowNull: true,
            },

            approval_comments: {
                type: DataTypes.TEXT,
                allowNull: true,
            },

            rejected_date: {
                type: DataTypes.DATE,
                allowNull: true,
            },

            rejection_comments: {
                type: DataTypes.TEXT,
                allowNull: true,
            },

            display_selling_cost: {
                type: DataTypes.FLOAT,
                allowNull: true,
            },

            mounting_selling_cost: {
                type: DataTypes.FLOAT,
                allowNull: true,
            },

            printing_selling_cost: {
                type: DataTypes.FLOAT,
                allowNull: true,
            },

            total_selling_cost: {
                type: DataTypes.FLOAT,
                allowNull: true,
            },

            display_buying_cost: {
                type: DataTypes.FLOAT,
                allowNull: true,
            },

            mounting_buying_cost: {
                type: DataTypes.FLOAT,
                allowNull: true,
            },

            printing_buying_cost: {
                type: DataTypes.FLOAT,
                allowNull: true,
            },

            total_buying_cost: {
                type: DataTypes.FLOAT,
                allowNull: true,
            },

            agency_commission_display: {
                type: DataTypes.FLOAT,
                allowNull: true,
            },

            agency_commission_mounting: {
                type: DataTypes.FLOAT,
                allowNull: true,
            },

            agency_commission_printing: {
                type: DataTypes.FLOAT,
                allowNull: true,
            },

            total_agency_commission: {
                type: DataTypes.FLOAT,
                allowNull: true,
            },

            total_client_cost_without_tax: {
                type: DataTypes.FLOAT,
                allowNull: true,
            },

            client_tax: {
                type: DataTypes.FLOAT,
                allowNull: true,
            },

            total_client_cost_with_tax: {
                type: DataTypes.FLOAT,
                allowNull: true,
            },

            total_vendor_cost_without_tax: {
                type: DataTypes.FLOAT,
                allowNull: true,
            },

            vendor_tax: {
                type: DataTypes.FLOAT,
                allowNull: true,
            },

            total_vendor_cost_with_tax: {
                type: DataTypes.FLOAT,
                allowNull: true,
            },

            sales_order_value: {
                type: DataTypes.FLOAT,
                allowNull: true,
            },

            sales_order_value_without_tax: {
                type: DataTypes.FLOAT,
                allowNull: true,
            },

            invoice_value: {
                type: DataTypes.FLOAT,
                allowNull: true,
            },

            purchase_order_value: {
                type: DataTypes.FLOAT,
                allowNull: true,
            },

            receipt_from_customer_value: {
                type: DataTypes.FLOAT,
                allowNull: true,
            },

            client_outstanding: {
                type: DataTypes.FLOAT,
                allowNull: true,
            },

            credit_note_value: {
                type: DataTypes.FLOAT,
                allowNull: true,
            },

            debit_note_value: {
                type: DataTypes.FLOAT,
                allowNull: true,
            },

            vendor_payment_value: {
                type: DataTypes.FLOAT,
                allowNull: true,
            },

            total_ndp_days: {
                type: DataTypes.INTEGER,
                allowNull: true,
            },

            total_ndp_value: {
                type: DataTypes.FLOAT,
                allowNull: true,
            },

            vendor_outstanding: {
                type: DataTypes.FLOAT,
                allowNull: true,
            },

            display_margin: {
                type: DataTypes.FLOAT,
                allowNull: true,
            },

            mounting_margin: {
                type: DataTypes.FLOAT,
                allowNull: true,
            },

            printing_margin: {
                type: DataTypes.FLOAT,
                allowNull: true,
            },

            overall_margin: {
                type: DataTypes.FLOAT,
                allowNull: true,
            },

            display_margin_percentage: {
                type: DataTypes.FLOAT,
                allowNull: true,
            },

            mounting_margin_percentage: {
                type: DataTypes.FLOAT,
                allowNull: true,
            },

            printing_margin_percentage: {
                type: DataTypes.FLOAT,
                allowNull: true,
            },

            overall_margin_percentage: {
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

        },
        { paranoid: true, timestamps: true },
    );

    return Estimate;
};
