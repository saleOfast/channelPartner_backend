module.exports = (sequelize, DataTypes) => {
    const siteCategories = sequelize.define("db_site_categories", // database table name
        {
            site_cat_id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },

            site_cat_code: {
                type: DataTypes.STRING,
                allowNull: true,
            },

            site_cat_name: {
                type: DataTypes.STRING,
                allowNull: true,
            },

            status: {
                type: DataTypes.BOOLEAN,
                default: true,
            },
        },
        { paranoid: true, timestamps: true },
    );


    return siteCategories;
};

