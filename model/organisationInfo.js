module.exports = (sequelize, DataTypes) => {
    const organisationInfo = sequelize.define("db_organisation_infos", // database table name
        {
            organisation_info_id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },

            company_name: {
                type: DataTypes.STRING,
                allowNull: true,
            },

            mobile: {
                type: DataTypes.BIGINT,
                allowNull: true,
            },

            email: {
                type: DataTypes.STRING,
                allowNull: true,
            },

            website: {
                type: DataTypes.STRING,
                allowNull: true,
            },

            country_id: {
                type: DataTypes.INTEGER,
                allowNull: true,
                references: {
                    model: 'db_countries',
                    key: 'country_id',
                }
            },

            state_id: {
                type: DataTypes.INTEGER,
                allowNull: true,
                references: {
                    model: 'db_states',
                    key: 'state_id',
                }
            },

            city_id: {
                type: DataTypes.INTEGER,
                allowNull: true,
                references: {
                    model: 'db_cities',
                    key: 'city_id',
                }
            },

            address: {
                type: DataTypes.STRING(100),
                allowNull: true,
            },

            pincode: {
                type: DataTypes.STRING,
                allowNull: true,
            },

            status: {
                type: DataTypes.BOOLEAN,
                default: true,
            },
        },
        { paranoid: true, timestamps: true },
    );


    return organisationInfo;
};

