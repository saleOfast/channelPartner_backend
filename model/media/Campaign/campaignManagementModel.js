module.exports = (sequelize, DataTypes) => {
    const MediaCampaigns = sequelize.define(
        "db_media_campaigns", // database table name
        {
            campaign_id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            campaign_name: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            sales_order_pdf: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            campaign_code: {
                type: DataTypes.STRING,
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
            cmpn_s_id: {
                type: DataTypes.INTEGER,
                allowNull: true,
                references: {
                    model: 'db_campaign_statuses',
                    key: 'cmpn_s_id',
                }
            },
            cmpn_p_id: {
                type: DataTypes.INTEGER,
                allowNull: true,
                references: {
                    model: 'db_campaign_proofs',
                    key: 'cmpn_p_id',
                }
            },
            cmpn_b_t_id: {
                type: DataTypes.INTEGER,
                allowNull: true,
                references: {
                    model: 'db_campaign_business_types',
                    key: 'cmpn_b_t_id',
                }
            },
            contact: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            campaign_brand: {
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
            proof_attachment: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            client_display_cost: {
                type: DataTypes.FLOAT,
                allowNull: true,
                defaultValue: 0,
            },
            client_mounting_cost: {
                type: DataTypes.FLOAT,
                allowNull: true,
                defaultValue: 0,
            },
            client_printing_cost: {
                type: DataTypes.FLOAT,
                allowNull: true,
                defaultValue: 0,
            },
            total_client_cost: {
                type: DataTypes.FLOAT,
                allowNull: true,
                defaultValue: 0,
            },
            total_sales_order_value: {
                type: DataTypes.FLOAT,
                allowNull: true,
                defaultValue: 0,
            },
            total_credit_note_value: {
                type: DataTypes.FLOAT,
                allowNull: true,
                defaultValue: 0,
            },
            total_receipt_from_client: {
                type: DataTypes.FLOAT,
                allowNull: true,
                defaultValue: 0,
            },
            total_client_outstanding: {
                type: DataTypes.FLOAT,
                allowNull: true,
                defaultValue: 0,
            },
            total_ndp_days: {
                type: DataTypes.INTEGER,
                allowNull: true,
                defaultValue: 0,
            },
            total_sales_invoice_value: {
                type: DataTypes.FLOAT,
                allowNull: true,
                defaultValue: 0,
            },
            total_vendor_display_cost: {
                type: DataTypes.FLOAT,
                allowNull: true,
                defaultValue: 0,
            },
            total_vendor_mounting_cost: {
                type: DataTypes.FLOAT,
                allowNull: true,
                defaultValue: 0,
            },
            total_vendor_printing_cost: {
                type: DataTypes.FLOAT,
                allowNull: true,
                defaultValue: 0,
            },
            total_vendor_cost: {
                type: DataTypes.FLOAT,
                allowNull: true,
                defaultValue: 0,
            },
            total_purchase_order_value: {
                type: DataTypes.FLOAT,
                allowNull: true,
                defaultValue: 0,
            },
            total_debit_note_value: {
                type: DataTypes.FLOAT,
                allowNull: true,
                defaultValue: 0,
            },
            total_vendor_payment: {
                type: DataTypes.FLOAT,
                allowNull: true,
                defaultValue: 0,
            },
            total_vendor_outstanding: {
                type: DataTypes.FLOAT,
                allowNull: true,
                defaultValue: 0,
            },
            total_ndp_value: {
                type: DataTypes.FLOAT,
                allowNull: true,
                defaultValue: 0,
            },
            overall_margin: {
                type: DataTypes.FLOAT,
                allowNull: true,
                defaultValue: 0,
            },
            display_margin: {
                type: DataTypes.FLOAT,
                allowNull: true,
                defaultValue: 0,
            },
            mounting_margin: {
                type: DataTypes.FLOAT,
                allowNull: true,
                defaultValue: 0,
            },
            printing_margin: {
                type: DataTypes.FLOAT,
                allowNull: true,
                defaultValue: 0,
            },
            overall_margin_percentage: {
                type: DataTypes.FLOAT,
                allowNull: true,
                defaultValue: 0,
            },
            display_margin_percentage: {
                type: DataTypes.FLOAT,
                allowNull: true,
                defaultValue: 0,
            },
            mounting_margin_percentage: {
                type: DataTypes.FLOAT,
                allowNull: true,
                defaultValue: 0,
            },
            printing_margin_percentage: {
                type: DataTypes.FLOAT,
                allowNull: true,
                defaultValue: 0,
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
            s_o_po_remarks: {
                type: DataTypes.TEXT,
                default: true,
            },
            status: {
                type: DataTypes.BOOLEAN,
                default: true,
                allowNull: true,
            },
        },
        { paranoid: true, timestamps: true }
    );

    return MediaCampaigns;
};
