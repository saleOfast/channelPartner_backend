module.exports = (sequelize, DataTypes) => {
    const mediaFormat = sequelize.define("db_media_formats", // database table name
        {
            m_f_id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },

            m_f_code: {
                type: DataTypes.STRING,
                allowNull: true,
            },

            m_f_name: {
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


    return mediaFormat;
};

