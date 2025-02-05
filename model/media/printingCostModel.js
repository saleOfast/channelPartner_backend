module.exports = (sequelize, DataTypes) => {
    const printingCost = sequelize.define("db_printing_costs", // database table name
        {
            pr_c_id: {
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

            pr_m_id: {
                type: DataTypes.INTEGER,
                allowNull: true,
                references: {
                    model: 'db_printing_materials', 
                    key: 'pr_m_id', 
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

            pr_c_cost: {
                type: DataTypes.INTEGER,
                allowNull: true,
            },

            pr_c_code: {
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


    return printingCost;
};

