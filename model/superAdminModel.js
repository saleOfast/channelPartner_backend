module.exports = (sequelize, DataTypes) => {
    const Super = sequelize.define("db_super", // database table name
        {
            user_id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            user: {
                type: DataTypes.STRING,
                allowNull: false,
            },

            superCode: {
                type: DataTypes.STRING,
                allowNull: true,
            },

            email: {
                type: DataTypes.STRING,
                allowNull: false,
            },

            password: {
                type: DataTypes.STRING,
                allowNull: false,
            },

            contact_number: {
                type: DataTypes.BIGINT,
                allowNull: true,
            },

            profile_img: {
                type: DataTypes.STRING,
                allowNull: true,
            },

        }, { paranoid: true, timestamps: true },
    );

    return Super;
};
