const { Sequelize, DataTypes } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    const quationMaster = sequelize.define(
    "db_quation_master", // database table name
    {
        quat_mast_id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
   
        opp_id:{
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: 'db_opportunities', 
                key: 'opp_id', 
            }
        },

        contact_no: {
            type: DataTypes.BIGINT,
            allowNull: true,
        },

        quat_code: {
            type: DataTypes.STRING,
            allowNull: true,
        },

        email: {
            type: DataTypes.STRING,
            allowNull: true,
        },

        quat_owner: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: 'db_users', 
                key: 'user_id', 
            }
        },

        quat_status: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: 'db_quat_statuses', 
                key: 'quat_status_id', 
            }
        },

        genrated_date: {
            type: DataTypes.DATE,
            allowNull: true,
        },

        valid_till: {
            type: DataTypes.DATE,
            allowNull: true,
        },

        quat_summery: {
            type: DataTypes.TEXT,
            allowNull: true,
        },

        bill_cont:{
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: 'db_countries', 
                key: 'country_id', 
            }
        },
        bill_state:{
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: 'db_states', 
                key: 'state_id', 
            }
        },

        bill_city:{
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: 'db_cities', 
                key: 'city_id', 
            }
        },

        bill_pincode:{
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        
        bill_address:{
            type: DataTypes.STRING,
            allowNull: true,
        },

        ship_cont:{
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: 'db_countries', 
                key: 'country_id', 
            }
        },
        ship_state:{
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: 'db_states', 
                key: 'state_id', 
            }
        },

        ship_city:{
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: 'db_cities', 
                key: 'city_id', 
            }
        },

        ship_pincode:{
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        
        ship_address: {
            type: DataTypes.STRING(255),
            allowNull: true
        },

        effective_date: {
            type: DataTypes.DATE,
            allowNull: true,
        },

        sub_total: {
            type: DataTypes.FLOAT,
            allowNull: true,
        },

        grand_total: {
            type: DataTypes.FLOAT,
            allowNull: true,
        },

        assigned_to: {
			type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: 'db_users', 
                key: 'user_id', 
            }
		},
        
    },
      { paranoid: true, timestamps: true }
    );
  
    return quationMaster;
  };
  