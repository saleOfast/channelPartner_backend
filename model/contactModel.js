module.exports = (sequelize, DataTypes) => {
    const Contact = sequelize.define("db_contact", // database table name
        {

            contact_id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },

            contact_owner: {
                type: DataTypes.INTEGER,
                allowNull: true,
                references: {
                    model: 'db_users',
                    key: 'user_id',
                }
            },

            first_name: {
                type: DataTypes.STRING,
                allowNull: true,
            },

            contact_code: {
                type: DataTypes.STRING,
                allowNull: true,
            },

            middle_name: {
                type: DataTypes.STRING,
                allowNull: true,
            },

            last_name: {
                type: DataTypes.STRING,
                allowNull: true,
            },

            saluation: {
                type: DataTypes.STRING,
                allowNull: true,
            },

            account_name: {
                type: DataTypes.INTEGER,
                allowNull: true,
                references: {
                    model: 'db_accounts',
                    key: 'acc_id',
                },
                onDelete: 'SET NULL',
                onUpdate: 'NO ACTION'
            },

            designation: {
                type: DataTypes.STRING,
                allowNull: true,
            },

            department: {
                type: DataTypes.STRING,
                allowNull: true,
            },

            contact_no: {
                type: DataTypes.BIGINT,
                allowNull: true,
            },

            email_id: {
                type: DataTypes.STRING(50),
                allowNull: true,
            },

            fax: {
                type: DataTypes.STRING,
                allowNull: true,
            },

            created_on: {
                type: DataTypes.DATE,
                allowNull: true,
            },

            updated_on: {
                type: DataTypes.DATE,
                allowNull: true,
            },

            mailing_cont: {
                type: DataTypes.INTEGER,
                allowNull: true,
                references: {
                    model: 'db_countries',
                    key: 'country_id',
                }
            },
            mailing_state: {
                type: DataTypes.INTEGER,
                allowNull: true,
                references: {
                    model: 'db_states',
                    key: 'state_id',
                }
            },

            mailing_city: {
                type: DataTypes.INTEGER,
                allowNull: true,
                references: {
                    model: 'db_cities',
                    key: 'city_id',
                }
            },

            mailing_pincode: {
                type: DataTypes.INTEGER,
                allowNull: true,
            },

            mailing_address: {
                type: DataTypes.TEXT,
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
        },
        { paranoid: true, timestamps: true },
    );


    return Contact;
};
