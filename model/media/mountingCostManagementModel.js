module.exports = (sequelize, DataTypes) => {
    const mountingCost = sequelize.define("db_mounting_costs", // database table name
        {
            mo_c_id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },

            acc_id: {
                type: DataTypes.INTEGER,
                allowNull: true,
                references: {
                    model: 'db_accounts', 
                    key: 'acc_id', 
                }
            },

            acc_name: {
                type: DataTypes.STRING,
                allowNull: true,
            },

            m_t_id: {
                type: DataTypes.INTEGER,
                allowNull: true,
                references: {
                    model: 'db_media_types',
                    key: 'm_t_id',
                }
            },

            mo_c_cost: {
                type: DataTypes.INTEGER,
                allowNull: true,
            },

            mo_c_code: {
                type: DataTypes.STRING,
                allowNull: true,
            },

            status: {
                type: DataTypes.ENUM('ACTIVE', 'INACTIVE'),
                allowNull: true,
            },

        },
        { paranoid: true, timestamps: true },
    );


    return mountingCost;
};

