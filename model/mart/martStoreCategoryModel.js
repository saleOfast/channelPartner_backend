const { Sequelize, DataTypes } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    const StoreCategory = sequelize.define(
        "db_mart_store_category", // database table name
        {
            store_category_id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            category_name: {
                type: DataTypes.STRING,
            },
            user_id: {
                type: DataTypes.INTEGER,
                allowNull: true,
                references: {
                    model: 'db_users', 
                    key: 'user_id', 
                }
            },
        },
        { paranoid: true, timestamps: true }
    );

    return StoreCategory;
};

