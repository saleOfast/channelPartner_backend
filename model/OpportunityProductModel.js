module.exports = (sequelize, DataTypes) => {
    const productOpportunity = sequelize.define("db_oppr_product", // database table name
      {
        o_p_id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },

        p_id: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: 'db_products', 
                key: 'p_id', 
            }
        },

        
        opp_id: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: 'db_opportunities', 
                key: 'opp_id', 
            }
        },

       qty: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },

        price: {
            type: DataTypes.FLOAT,
            allowNull: true,
        },

        product_discount: {
            type: DataTypes.FLOAT,
            allowNull: true,
        },

        product_amount: {
            type: DataTypes.FLOAT,
            allowNull: true,
        },
       
      },
      { paranoid: true, timestamps: true },   
    );
    
  
    return productOpportunity;
  };
  