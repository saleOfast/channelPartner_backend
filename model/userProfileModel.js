module.exports = (sequelize, DataTypes) => {
  const userProfile = sequelize.define(
    "db_user_profile", // database table name
    {
      user_profle_id: {
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

      div_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "db_divisions", 
          key: "div_id", 
        },
      },

      dep_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "db_departments", 
          key: "dep_id", 
        },
      },

      des_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "db_designations", 
          key: "des_id", 
        },
      },

      aadhar_no: {
        type: DataTypes.BIGINT,
        allowNull: true,
      },

      aadhar_file: {
        type: DataTypes.STRING,
        allowNull: true,
      },

      pan_no: {
        type: DataTypes.STRING,
        allowNull: true,
      },

      pan_file: {
        type: DataTypes.STRING,
        allowNull: true,
      },

      dl_no: {
        type: DataTypes.STRING,
        allowNull: true,
      },

      dl_file: {
        type: DataTypes.STRING,
        allowNull: true,
      },

      rera_no: {
        type: DataTypes.STRING,
        allowNull: true,
      },

      rera_file: {
        type: DataTypes.STRING,
        allowNull: true,
      },

      c_cheque: {
        type: DataTypes.STRING,
        allowNull: true,
      },

      c_cheque_file: {
        type: DataTypes.STRING,
        allowNull: true,
      },

      user_image_file: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      bank_name: {
        type: DataTypes.STRING,
        allowNull: true,
      },

      account_holder_name: {
        type: DataTypes.STRING,
        allowNull: true,
      },

      account_no: {
        type: DataTypes.BIGINT,
        allowNull: true,
      },

      bank_ifsc_code: {
        type: DataTypes.STRING,
        allowNull: true,
      },

      branch: {
        type: DataTypes.STRING,
        allowNull: true,
      },

      //DMS Fields

      contact_person: {
        type: DataTypes.STRING,
        allowNull: true,
      },

      // tier: {
      //   type: DataTypes.STRING,
      //   allowNull: true,
      // },

      credit_limit: {
        type: DataTypes.STRING,
        allowNull: true,
      },

      incorporation_certificate: {   //Certificate of incorporation
        type: DataTypes.STRING,
        allowNull: true,
      },

      payment_method: {
        type: DataTypes.STRING,
        allowNull: true,
      },

      distributor_rating: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },

      address_proof: {
        type: DataTypes.STRING,
        allowNull: true,
      },

      gst_registration: {
        type: DataTypes.STRING,
        allowNull: true,
      },

      banking_details: {
        type: DataTypes.STRING,
        allowNull: true,
      },

    },
    { paranoid: true, timestamps: true }
  );

  return userProfile;
};
