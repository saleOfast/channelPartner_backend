module.exports = (sequelize, DataTypes) => {
    const Cp_lead = sequelize.define("db_channel_partner_lead_details", // database table name
        {
            cpl_d_id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },

            cpl_id: {
                type: DataTypes.INTEGER,
                allowNull: true,
                references: {
                    model: 'db_channel_partner_leads',
                    key: 'cpl_id',
                }
            },
            
            stage: {
                type: DataTypes.ENUM('OPEN', 'CONTACTED', 'LINK SENT', 'ONBOARDED', 'NOT INTERESTED', 'CALL', 'VISIT', 'FOLLOW UP'),
                default: 'OPEN',
                allowNull: false,
            },

            follow_up_date: {
                type: DataTypes.DATE,
                allowNull: true,
            },

            remarks: {
                type: DataTypes.STRING,
                allowNull: true,
            },

            status: {
                type: DataTypes.BOOLEAN,
                default: true,
                allowNull: false,
            },

        },
        { paranoid: true, timestamps: true }
    );

    return Cp_lead;
};
