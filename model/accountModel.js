module.exports = (sequelize, DataTypes) => {
    const Account = sequelize.define("db_account", // database table name
        {
            acc_id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },

            acc_code: {
                type: DataTypes.STRING,
                allowNull: true,
            },

            acc_name: {
                type: DataTypes.STRING,
                allowNull: true,
            },

            acc_owner: {
                type: DataTypes.INTEGER,
                allowNull: true,
                references: {
                    model: 'db_users', 
                    key: 'user_id', 
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

            parent_id: {
                type: DataTypes.STRING,
                allowNull: true,
            },

            parent_name: {
                type: DataTypes.STRING,
                allowNull: true,
            },

            website: {
                type: DataTypes.STRING,
                allowNull: true,
            },

            contact_no: {
                type: DataTypes.BIGINT,
                allowNull: true,
            },

            phone_no: {
                type: DataTypes.BIGINT,
                allowNull: true,
            },

            ind_id: {
                type: DataTypes.INTEGER,
                allowNull: true,
                references: {
                    model: 'db_industries', 
                    key: 'ind_id', 
                }
            },

            emp_name: {
                type: DataTypes.STRING,
                allowNull: true,
            },

            desc: {
                type: DataTypes.TEXT,
                allowNull: true,
            },

            bill_cont: {
                type: DataTypes.INTEGER,
                allowNull: true,
                references: {
                    model: 'db_countries', 
                    key: 'country_id', 
                }
            },
            bill_state: {
                type: DataTypes.INTEGER,
                allowNull: true,
                references: {
                    model: 'db_states', 
                    key: 'state_id', 
                }
            },

            bill_city: {
                type: DataTypes.INTEGER,
                allowNull: true,
                references: {
                    model: 'db_cities', 
                    key: 'city_id', 
                }
            },

            bill_pincode: {
                type: DataTypes.INTEGER,
                allowNull: true,
            },

            bill_address: {
                type: DataTypes.STRING(255),
                allowNull: true
            },


            ship_cont: {
                type: DataTypes.INTEGER,
                allowNull: true,
                references: {
                    model: 'db_countries', 
                    key: 'country_id', 
                }
            },
            ship_state: {
                type: DataTypes.INTEGER,
                allowNull: true,
                references: {
                    model: 'db_states', 
                    key: 'state_id', 
                }
            },

            ship_city: {
                type: DataTypes.INTEGER,
                allowNull: true,
                references: {
                    model: 'db_cities', 
                    key: 'city_id', 
                }
            },

            ship_pincode: {
                type: DataTypes.INTEGER,
                allowNull: true,
            },

            ship_address: {
                type: DataTypes.STRING(255),
                allowNull: true
            },

            assigned_to: {
                type: DataTypes.INTEGER,
                allowNull: true,
                references: {
                    model: 'db_users', 
                    key: 'user_id', 
                }
            },
            email_id: {
                type: DataTypes.STRING(50),
                allowNull: true,
            },
            star_rating: {
                type: DataTypes.INTEGER,
                allowNull: true,
            },

            // Bank Details Section
            bank_name: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            bank_ac_no: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            ifsc_code: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            micr_code: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            credit_limit: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            cin_number: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            tan_number: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            pan_number: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            gstin_number: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            service_tax_number: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            // Finance Section
            contact_person_finance: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            designation_finance: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            mobile_finance: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            email_finance: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            debit_note: {
                type: DataTypes.ENUM('Yes', 'No'),
                allowNull: true,
            },
            credit_note: {
                type: DataTypes.ENUM('Yes', 'No'),
                allowNull: true,
            },
            volume_deal_agreement: {
                type: DataTypes.ENUM('Yes', 'No'),
                allowNull: true,
            },
            volume_deal_percentage: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            platform_id: {
                type: DataTypes.INTEGER,
                allowNull: true,
                references: {
                    model: 'db_platforms', 
                    key: 'platform_id', 
                }
            },
        },

        { paranoid: true, timestamps: true },
    );


    return Account;
};
