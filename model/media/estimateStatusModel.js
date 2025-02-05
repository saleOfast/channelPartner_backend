module.exports = (sequelize, DataTypes) => {
    const estimateStatus = sequelize.define("db_estimate_statuses", // database table name
        {
            est_s_id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },

            est_s_code: {
                type: DataTypes.STRING,
                allowNull: true,
            },

            est_s_name: {
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


    return estimateStatus;
};

