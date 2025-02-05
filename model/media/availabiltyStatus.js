module.exports = (sequelize, DataTypes) => {
    const availabiltyStatus = sequelize.define("db_availabilty_statuses", // database table name
        {
            a_s_id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },

            a_s_code: {
                type: DataTypes.STRING,
                allowNull: true,
            },

            a_s_name: {
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


    return availabiltyStatus;
};

