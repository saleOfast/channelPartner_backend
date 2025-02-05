module.exports = (sequelize, DataTypes) => {
    const mediaVehicle = sequelize.define("db_media_vehicles", // database table name
        {
            m_v_id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },

            m_f_id: {
                type: DataTypes.INTEGER,
                allowNull: true,
                references: {
                    model: 'db_media_formats', 
                    key: 'm_f_id', 
                }
            },

            m_v_code: {
                type: DataTypes.STRING,
                allowNull: true,
            },

            m_v_name: {
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


    return mediaVehicle;
};

