module.exports = (sequelize, DataTypes) => {
    const campaignStatus = sequelize.define("db_campaign_statuses", // database table name
        {
            cmpn_s_id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },

            cmpn_s_code: {
                type: DataTypes.STRING,
                allowNull: true,
            },

            cmpn_s_name: {
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


    return campaignStatus;
};

