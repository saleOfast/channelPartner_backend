module.exports = (sequelize, DataTypes) => {
    const LeadVisit = sequelize.define("db_lead_visit", // database table name
      {
        visit_id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },

        visit_code: {
            type: DataTypes.STRING,
            allowNull: true,
        },

        status: {
            type: DataTypes.ENUM('Requested', 'Scheduled', 'Rescheduled', 'Completed', "Rejected", "VISIT NOT DONE"),
            defaultValue: 'Requested',
            allowNull: true
        },

        p_visit_date: {
			type: DataTypes.DATEONLY,
            allowNull: true,
		},

		p_visit_time: {
			type: DataTypes.TIME,
            allowNull: true,
		},

        revisit_date: {
			type: DataTypes.DATEONLY,
            allowNull: true,
		},

		revisit_time: {
			type: DataTypes.TIME,
            allowNull: true,
		},

        lead_id: {
			type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: 'db_leads', 
                key: 'lead_id', 
            }
		},

        sales_visit_id: {
            type: DataTypes.STRING,
            allowNull: true,
        },

      },
      { paranoid: true, timestamps: true },   
    );
    
  
    return LeadVisit;
  };
  