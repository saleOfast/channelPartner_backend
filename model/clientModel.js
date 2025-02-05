module.exports = (sequelize, DataTypes) => {
  const Client = sequelize.define(
    "db_client", // database table name
    {
      user_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      user: {
        type: DataTypes.STRING,
        allowNull: false,
      },

      email: {
        type: DataTypes.STRING,
        allowNull: false,
      },

      contact_number: {
        type: DataTypes.BIGINT,
        allowNull: true,
      },

      password: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: "",
      },

      db_name: {
        type: DataTypes.STRING,
        allowNull: false,
      },

      isDB: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },

      user_status: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },

      doc_verification: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },

      user_code: {
        type: DataTypes.STRING,
        allowNull: true,
      },

      user_verify_otp: {
        type: DataTypes.INTEGER,
        default: null,
      },

      password_reset_token: {
        type: DataTypes.STRING,
        default: null,
      },

      password_reset_expires: {
        type: DataTypes.DATE,
        default: null,
      },

      subscription_start_date: {
        type: DataTypes.DATEONLY,
        default: null,
      },

      subscription_end_date: {
        type: DataTypes.DATEONLY,
        default: null,
      },

      subscription_start_date_channel: {
        type: DataTypes.DATEONLY,
        default: null,
      },

      subscription_end_date_channel: {
        type: DataTypes.DATEONLY,
        allowNull: true,
        default: null,
      },

      subscription_start_date_dms: {
        type: DataTypes.DATEONLY,
        allowNull: true,
        default: null,
      },

      subscription_end_date_dms: {
        type: DataTypes.DATEONLY,
        allowNull: true,
        default: null,
      },

      subscription_start_date_sales: {
        type: DataTypes.DATEONLY,
        default: null,
      },

      subscription_end_date_sales: {
        type: DataTypes.DATEONLY,
        default: null,
      },

      subscription_start_date_media: {
        type: DataTypes.DATEONLY,
        default: null,
      },

      subscription_end_date_media: {
        type: DataTypes.DATEONLY,
        default: null,
      },

      no_of_months: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },

      domain: {
        type: DataTypes.STRING,
        allowNull: true,
      },

      no_of_license: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },

      no_of_channel_license: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },

      no_of_dms_license: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },

      no_of_sales_license: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },

      no_of_media_license: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },

      sidebar_color: {
        type: DataTypes.STRING,
        allowNull: true,
      },

      button_color: {
        type: DataTypes.STRING,
        allowNull: true,
      },

      text_color: {
        type: DataTypes.STRING,
        allowNull: true,
      },

      top_nav_color: {
        type: DataTypes.STRING,
        allowNull: true,
      },

      gst: {
        type: DataTypes.STRING,
        allowNull: true,
      },

      pan: {
        type: DataTypes.STRING,
        allowNull: true,
      },

      address: {
        type: DataTypes.STRING,
        allowNull: true,
      },

      nda: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: false,
      },

      remarks: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      logo: {
        type: DataTypes.STRING,
        allowNull: true,
      },

      client_url: {
        type: DataTypes.STRING,
        allowNull: true,
      },

      client_image_1: {
        type: DataTypes.STRING,
        allowNull: true,
      },

      client_image_2: {
        type: DataTypes.STRING,
        allowNull: true,
      },

      client_image_3: {
        type: DataTypes.STRING,
        allowNull: true,
      },

      client_image_4: {
        type: DataTypes.STRING,
        allowNull: true,
      },

      host_name: {
        type: DataTypes.STRING,
        allowNull: true,
      },

      salesforce_url: {
        type: DataTypes.STRING,
        allowNull: true,
      },

      grant_type: {
        type: DataTypes.STRING,
        allowNull: true,
      },

      salesforce_client_id: {
        type: DataTypes.STRING,
        allowNull: true,
      },

      salesforce_client_pwd: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    },
    { paranoid: true, timestamps: true }
  );

  return Client;
};
