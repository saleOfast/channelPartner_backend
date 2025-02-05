module.exports = (sequelize, DataTypes) => {
    const ndp_r = sequelize.define("db_ndp_reasons", // database table name
        {
            ndp_r_id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },

            ndp_r_code: {
                type: DataTypes.STRING,
                allowNull: true,
            },

            ndp_r_name: {
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


    return ndp_r;
};

