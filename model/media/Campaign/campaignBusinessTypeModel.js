module.exports = (sequelize, DataTypes) => {
    const campaignBusinessType = sequelize.define("db_campaign_business_types", // database table name
        {
            cmpn_b_t_id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },

            cmpn_b_t_code: {
                type: DataTypes.STRING,
                allowNull: true,
            },

            cmpn_b_t_name: {
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


    return campaignBusinessType;
};

