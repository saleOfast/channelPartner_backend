module.exports = (sequelize, DataTypes) => {
    const dmsBanner = sequelize.define(
        "db_warehouse", // database table name
        {
            warehouse_id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },

            country_id: {
                type: DataTypes.INTEGER,
                allowNull: true,
                references: {
                    model: "db_countries",
                    key: "country_id",
                },
            },

            state_id: {
                type: DataTypes.INTEGER,
                allowNull: true,
                references: {
                    model: "db_states",
                    key: "state_id",
                },
            },

            city_id: {
                type: DataTypes.INTEGER,
                allowNull: true,
                references: {
                    model: "db_cities",
                    key: "city_id",
                },
            },

            address: {
                type: DataTypes.INTEGER,
                allowNull: true,
            },

            no_of_loose_packets: {
                type: DataTypes.INTEGER,
                allowNull: true,
            },

            final_quantity: {
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
