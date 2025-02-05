module.exports = (sequelize, DataTypes) => {
    const dmsBanner = sequelize.define("db_inventories", // database table name
        {
            inventory_id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },

            product_id: {
                type: DataTypes.INTEGER,
                allowNull: true,
                references: {
                    model: 'db_products',
                    key: 'p_id',
                }
            },

            warehouse_id: {
                type: DataTypes.INTEGER,
                allowNull: true,
                references: {
                    model: 'warehouse_id',
                    key: 'db_warehouse',
                }
            },

            no_of_cases: {                  //Kitne box hai
                type: DataTypes.INTEGER,
                allowNull: true,
            },

            no_of_loose_packets: {         //Kitne khulle packet hai
                type: DataTypes.INTEGER,
                allowNull: true,
            },

            final_quantity: {               //kitne packets hai. Cases ke packets or khulle packet hai
                type: DataTypes.INTEGER,
                allowNull: true,
            },

            price_per_case: {
                type: DataTypes.INTEGER,
                allowNull: true,
            },

            activity: {
                type: DataTypes.ENUM('INWARD', 'OUTWARD'),
                allowNull: true,
            },

            activity_symbol: {
                type: DataTypes.ENUM('+', '-'),
                allowNull: true,
            },

            batch_number: {
                type: DataTypes.STRING,
                allowNull: true,
            },

            expiry_date: {
                type: DataTypes.DATEONLY,
                allowNull: true,
            },

            status: {
                type: DataTypes.BOOLEAN,
                defaultValue: true,
                allowNull: true,
            },
        },
        {
            paranoid: true,
            timestamps: true
        }
    );

    return dmsBanner;
};
