module.exports = (sequelize, DataTypes) => {
    const Estimation = sequelize.define("db_estimation_types", // database table name
        {
            est_t_id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },

            est_t_code: {
                type: DataTypes.STRING,
                allowNull: true,
            },

            est_t_name: {
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


    return Estimation;
};

