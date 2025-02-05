module.exports = (sequelize, DataTypes) => {
    const CConversionModel = sequelize.define("db_conversions", // database table name
        {
            conversion_id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },

            conversion_code: {
                type: DataTypes.STRING,
                allowNull: true,
            },

            conversion_amount: {
                type: DataTypes.INTEGER,
                allowNull: true,
            },

            status: {
                type: DataTypes.BOOLEAN,
                default: true,
            },
        },
        { paranoid: true, timestamps: true },
    );
    return CConversionModel;
};

