module.exports = (sequelize, DataTypes) => {
    const paymentStatus = sequelize.define("db_payment_statuses", // database table name
        {
            p_s_id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },

            p_s_code: {
                type: DataTypes.STRING,
                allowNull: true,
            },

            p_s_name: {
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


    return paymentStatus;
};

