module.exports = (sequelize, DataTypes) => {
    const printingMaterial = sequelize.define("db_printing_material", // database table name
        {
            pr_m_id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },

            pr_m_code: {
                type: DataTypes.STRING,
                allowNull: true,
            },

            pr_m_name: {
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


    return printingMaterial;
};

