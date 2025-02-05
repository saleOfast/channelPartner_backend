module.exports = (sequelize, DataTypes) => {
    const dmsOrderItems = sequelize.define(
      "db_dms_order_item", // database table name
      {
        u_id: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },


        o_id: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
              model: "db_dms_orders", 
              key: "o_id", 
            },
        },
  

        p_id: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
              model: "db_products", 
              key: "p_id", 
            },
        },

        o_status: {
            type: DataTypes.ENUM('confirm', 'shipped', 'dipsatched', 'delivered', 'cancel', 'returned' , 'return_requested'),
            defaultValue: 'confirm',
            allowNull: true,
        },
  

        price: {
          type: DataTypes.DECIMAL(10,2),
          allowNull: true,
          default: 0,
        },

        product_discount: {
            type: DataTypes.INTEGER,
            allowNull: true,
            default: 0,
        },

        product_unit: {
          type: DataTypes.INTEGER,
          allowNull: true,
        },
        

        cases: {
            type: DataTypes.INTEGER,
            allowNull: true,
            defalutValue: 0
        },

        piece: {
            type: DataTypes.INTEGER,
            allowNull: true,
            defalutValue: 0
        },

      },
      { paranoid: true, timestamps: true }
    );
  
    return dmsOrderItems;
  };
  