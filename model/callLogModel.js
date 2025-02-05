module.exports = (sequelize, DataTypes) => {
    const leadCalls = sequelize.define(
    "db_lead_log", // database table name
    {
        call_lead_id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },

        lead_id: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: 'db_leads', 
                key: 'lead_id', 
            }
        },

        link_with_opportunity: {
			type: DataTypes.INTEGER,
			allowNull: true,
			references: {
				model: 'db_opportunities', 
				key: 'opp_id', 
			}
		},

		event_type: {
            type: DataTypes.ENUM('lead event', 'opportunity event'),
            allowNull: true,
			defaultValue: 'lead event'
        },


        call_subject:{
            type: DataTypes.STRING,
            allowNull: true,
        },

        comments:{
            type: DataTypes.STRING,
            allowNull: true,
        },
        
        relate_to:{
            type: DataTypes.STRING,
            allowNull: true,
        },

        contact_person_name:{
            type: DataTypes.STRING,
            allowNull: true,
        },

        event_date:{
            type: DataTypes.DATE,
            allowNull: true,
        },

        cts_no:{
            type: DataTypes.STRING,
            allowNull: true,
        },
    },
      { paranoid: true, timestamps: true }
    );
  
    return leadCalls;
  };
  