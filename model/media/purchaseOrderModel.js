module.exports = (sequelize, DataTypes) => {
    const purchaseOrder = sequelize.define("db_purchase_orders", // database table name
        {
            p_o_id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },

            p_o_code: {
                type: DataTypes.STRING,
                allowNull: true,
            },

            p_o_date: {
                type: DataTypes.DATE,
                allowNull: true,
            },

            month: {
                type: DataTypes.STRING,
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

            m_t_id: {
                type: DataTypes.INTEGER,
                allowNull: true,
                references: {
                    model: 'db_media_types',
                    key: 'm_t_id',
                }
            },

            m_t_name: {
                type: DataTypes.STRING,
                allowNull: true,
            },

            p_o_cost: {
                type: DataTypes.INTEGER(100),
                allowNull: true,
            },

            p_o_start_date: {
                type: DataTypes.DATEONLY,
                allowNull: true,
            },

            p_o_end_date: {
                type: DataTypes.DATEONLY,
                allowNull: true,
            },

            p_o_days: {
                type: DataTypes.INTEGER,
                allowNull: true,
            },

            p_o_ndp_days: {
                type: DataTypes.INTEGER,
                allowNull: true,
            },

            p_o_invoice: {
                type: DataTypes.TEXT,
                allowNull: true,
            },

            p_o_payment_status: {
                type: DataTypes.ENUM('PENDING', 'IN-PROGRESS', 'DONE'),
                allowNull: true,
            },

            p_s_id: {
                type: DataTypes.INTEGER,
                allowNull: true,
                references: {
                    model: 'db_payment_statuses',
                    key: 'p_s_id',
                }
            },

            //DEBIT NOTE DETAILS

            p_o_debit_note_no: {
                type: DataTypes.TEXT,
                allowNull: true,
            },

            p_o_debit_note_date: {
                type: DataTypes.DATE,
                allowNull: true,
            },

            p_o_debit_note_percentage: {
                type: DataTypes.INTEGER,
                allowNull: true,
            },

            p_o_debit_note_amount: {
                type: DataTypes.INTEGER,
                allowNull: true,
            },

            p_o_debit_note_gst: {
                type: DataTypes.INTEGER,
                allowNull: true,
            },

            p_o_debit_note_remarks: {
                type: DataTypes.TEXT,
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

            status: {
                type: DataTypes.BOOLEAN,
                default: true,
            },
        },
        { paranoid: true, timestamps: true },
    );


    return purchaseOrder;
};

