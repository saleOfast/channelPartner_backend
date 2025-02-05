module.exports = (sequelize, DataTypes) => {
    const LeadReVisit = sequelize.define("db_lead_revisits", // database table name
        {
            revisit_id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },

            visit_id: {
                type: DataTypes.INTEGER,
                allowNull: true,
                references: {
                    model: 'db_lead_visits', 
                    key: 'visit_id', 
                }
            },

            lead_id: {
                type: DataTypes.INTEGER,
                allowNull: true,
                references: {
                    model: 'db_leads', 
                    key: 'lead_id', 
                }
            },
            
            revisit_date: {
                type: DataTypes.DATEONLY,
                allowNull: true,
            },

            revisit_time: {
                type: DataTypes.TIME,
                allowNull: true,
            },

            remark: {
                type: DataTypes.STRING(100),
                allowNull: true,
            },

        },
        { paranoid: true, timestamps: true },
    );


    return LeadReVisit;
};
