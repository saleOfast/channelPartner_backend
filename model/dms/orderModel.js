module.exports = (sequelize, DataTypes) => {
    const dmsOrder = sequelize.define(
      "db_dms_order", // database table name
      {
        o_id: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },

        user_id: {
          type: DataTypes.INTEGER,
          allowNull: true,
          references: {
            model: "db_users", 
            key: "user_id", 
          },
        },
  
        payment_id: {
          type: DataTypes.STRING,
          allowNull: true,
        },

        order_id: {
            type: DataTypes.STRING,
            allowNull: true,
        },

        signature: {
            type: DataTypes.STRING,
            allowNull: true,
        },

        p_status: {
          type: DataTypes.ENUM('pending', 'paid', 'canceled', 'returned'),
          allowNull: true,
        },

        shipment_status: {
            type: DataTypes.ENUM('pending', 'shipped', 'cancled', 'dispatch', 'returned' , 'return_requested', 'return_cancel'),
            defaultValue: 'pending',
            allowNull: true,
        },
  
        sub_total: {
          type: DataTypes.DECIMAL(10,2),
          allowNull: true,
          default: 0,
        },

        total_price: {
          type: DataTypes.DECIMAL(10,2),
          allowNull: true,
          default: 0,
        },

        discount: {
            type: DataTypes.INTEGER,
            allowNull: true,
            default: 0,
        },

        voucher_type: {
            type: DataTypes.ENUM('percent', 'flat'),
            allowNull: true,
        },

        voucher_value: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },

    
      created_on:{
        type: DataTypes.DATE,
        allowNull: true,
      },

      updated_on:{
        type: DataTypes.DATE,
        allowNull: true,
      },


      },
      { paranoid: true, timestamps: true }
    );
  
    return dmsOrder;
  };
  