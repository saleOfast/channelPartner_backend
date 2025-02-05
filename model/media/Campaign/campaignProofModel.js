module.exports = (sequelize, DataTypes) => {
    const campaignProof = sequelize.define("db_campaign_proofs", // database table name
        {
            cmpn_p_id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },

            cmpn_p_code: {
                type: DataTypes.STRING,
                allowNull: true,
            },

            cmpn_p_name: {
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


    return campaignProof;
};

