module.exports = (sequelize, DataTypes) => {
    const siteStatus = sequelize.define("db_site_statuses", // database table name
        {
            s_s_id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },

            s_s_code: {
                type: DataTypes.STRING,
                allowNull: true,
            },

            s_s_name: {
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


    return siteStatus;
};

