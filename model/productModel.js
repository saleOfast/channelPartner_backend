module.exports = (sequelize, DataTypes) => {
    const products = sequelize.define(
        "db_product", // database table name
        {
            p_id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },

            p_code: {
                type: DataTypes.STRING,
                allowNull: true,
            },

            p_name: {
                type: DataTypes.STRING,
                allowNull: true,
            },

            p_price: {
                type: DataTypes.DECIMAL(10, 2),
                allowNull: true,
            },
            unit_in_case: {
                type: DataTypes.INTEGER,
                allowNull: true,
            },
            image: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            p_cat_id: {
                type: DataTypes.INTEGER,
                allowNull: true,
                references: {
                    model: "db_p_cats",
                    key: "p_cat_id",
                },
            },
            brand_id: {
                type: DataTypes.INTEGER,
                allowNull: true,
                references: {
                    model: "db_dms_brands",
                    key: "brand_id",
                },
            },
            discount: {
                type: DataTypes.INTEGER,
                allowNull: true,
                default: 0,
            },
            p_desc: {
                type: DataTypes.TEXT,
                defaultValue: true,
            },

            status: {
                type: DataTypes.BOOLEAN,
                allowNull: true,
                default: 1,
            },

            created_on: {
                type: DataTypes.DATE,
                allowNull: true,
            },
            updated_on: {
                type: DataTypes.DATE,
                allowNull: true,
            },
        },
        { paranoid: true, timestamps: true }
    );

    return products;
};
