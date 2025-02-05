module.exports = (sequelize, DataTypes) => {
    const dmsCoupon = sequelize.define(
    "db_dms_coupon", // database table name
    {
        coupon_id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },

        type: {
            type: DataTypes.ENUM('percent', 'flat'),
            defaulValue: 'percent',
            allowNull: false,
        },

        use_type: {
            type: DataTypes.ENUM('public', 'private'),
            defaulValue: 'public',
            allowNull: false,
        },
   
        coupon_name: {
            type: DataTypes.STRING(200),
            allowNull: false,
        },

        value: {
            type: DataTypes.STRING(200),
            allowNull: false,
        },


    },
      { paranoid: true, timestamps: true }
    );
  
    return dmsCoupon;
  };
  