module.exports = (sequelize, DataTypes) => {
    const LeadBrokerage = sequelize.define("db_lead_brokerage", // database table name
      {
        brokerage_id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },

        brokerage_code: {
			type: DataTypes.STRING,
			allowNull: true,
		},

        amount: {
            type: DataTypes.DOUBLE(11,2),
            allowNull: true,
        },

        date: {
			type: DataTypes.DATEONLY,
            allowNull: true,
		},

        booking_id: { 
			type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: 'db_lead_bookings', 
                key: 'booking_id', 
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

        bill_file: { 
			type: DataTypes.STRING,
            allowNull: true,
		},

        status: {
            type: DataTypes.ENUM('Bill sent', 'Bill Received' , 'Payment Initiated', 'Payment Received', 'Payment Rejected'),
            allowNull: true
        },

        reject_remark: {
            type: DataTypes.STRING,
            allowNull: true
        },

      },
      { paranoid: true, timestamps: true },   
    );
    
  
    return LeadBrokerage;
  };
  