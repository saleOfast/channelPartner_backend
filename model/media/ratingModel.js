module.exports = (sequelize, DataTypes) => {
    const rating = sequelize.define("db_ratings", // database table name
        {
            rating_id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },

            rating_code: {
                type: DataTypes.STRING,
                allowNull: true,
            },

            rating_name: {
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


    return rating;
};

