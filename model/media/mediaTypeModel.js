module.exports = (sequelize, DataTypes) => {
    const mediaTypes = sequelize.define("db_media_types", // database table name
        {
            m_t_id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },

            m_t_code: {
                type: DataTypes.STRING,
                allowNull: true,
            },

            m_t_name: {
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


    return mediaTypes;
};

