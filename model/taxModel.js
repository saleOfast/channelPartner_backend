const { Sequelize, DataTypes } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    const tax = sequelize.define("db_tax", // database table name
    {
        tax_id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        tax_code: {
            type: DataTypes.STRING(200),
            allowNull: true,
        },
        tax_type: {
            type: DataTypes.STRING(255),
            allowNull: true,
        },
        tax_percentage: {
            type: DataTypes.FLOAT,
            allowNull: true
        },
        description: {
            type: DataTypes.STRING(200)
        },
        is_active: {
            type: DataTypes.BOOLEAN,
            allowNull: true,
            defaultValue: true
        },
        created_date: {
            type: DataTypes.DATE,
            allowNull: true,
            // get() {
            //         const createdAt = this.getDataValue('created_date');
            //         // format the date as "dd-mm-yyyy hh:mm:ss"
            //         const formattedDate = createdAt.toLocaleString('en-GB', {
            //         day: '2-digit',
            //         month: '2-digit',
            //         year: 'numeric',
            //         hour: '2-digit',
            //         minute: '2-digit',
            //         second: '2-digit'
            //         }).replace(/\//g, '-').replace(/,/g, '');
            //         return formattedDate;
            //     }
        },
        gts_type: {
            type: DataTypes.STRING(8),
            allowNull: true
        },
        tax_name: {
            type: DataTypes.STRING(200)
        },
        
        
        position: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        state_type: {
            type: DataTypes.STRING(255),
            allowNull: true
        },
        tax_value_type: {
            type: DataTypes.STRING(255),
            allowNull: true,
            defaultValue: 'Percentage',
            comment: 'Percentage,Value'
        },
        updated_by: {
            type: DataTypes.INTEGER,
			allowNull: true,
			references: {
				model: 'db_users', 
				key: 'user_id', 
			}
        },
        mode: {
            type: DataTypes.STRING(50),
            allowNull: true,
            defaultValue: 'Web'
        }
      },
      { paranoid: true, timestamps: true },   
    );
    
  
    return tax;
  };
  
