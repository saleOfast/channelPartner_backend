module.exports = (sequelize, DataTypes) => {
    const Opportunity = sequelize.define("db_opportunity", // database table name
        {
            opp_id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },

            opp_name: {
                type: DataTypes.STRING,
                allowNull: true,
            },

            opp_code: {
                type: DataTypes.STRING,
                allowNull: true,
            },

            opp_owner: {
                type: DataTypes.INTEGER,
                allowNull: true,
                references: {
                    model: 'db_users',
                    key: 'user_id',
                },
                onDelete: 'SET NULL',
                onUpdate: 'NO ACTION'
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

            contact_id: {
                type: DataTypes.INTEGER,
                allowNull: true,
                references: {
                    model: 'db_contacts',
                    key: 'contact_id',
                },
                onDelete: 'SET NULL',
                onUpdate: 'NO ACTION'
            },

            close_date: {
                type: DataTypes.DATE,
                allowNull: true,
            },

            close_lost_reason: {
                type: DataTypes.STRING,
                allowNull: true,
            },

            opportunity_stg_id: {
                type: DataTypes.INTEGER,
                allowNull: true,
                references: {
                    model: 'db_opportunity_stgs',
                    key: 'opportunity_stg_id',
                }
            },

            opportunity_type_id: {
                type: DataTypes.INTEGER,
                allowNull: true,
                references: {
                    model: 'db_opportunity_types',
                    key: 'opportunity_type_id',
                }
            },

            lead_src_id: {
                type: DataTypes.INTEGER,
                allowNull: true,
                references: {
                    model: 'db_lead_sources',
                    key: 'lead_src_id',
                }
            },

            desc: {
                type: DataTypes.TEXT,
                allowNull: true,
            },

            amount: {
                type: DataTypes.INTEGER,
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

            assigned_to: {
                type: DataTypes.INTEGER,
                allowNull: true,
                references: {
                    model: 'db_users',
                    key: 'user_id',
                },
            },

            remark: {
                type: DataTypes.TEXT,
                allowNull: true,
            },
            conversion_perc: {
                type: DataTypes.INTEGER,
                allowNull: true,
            },

        },
        { paranoid: true, timestamps: true },
    );


    return Opportunity;
};
