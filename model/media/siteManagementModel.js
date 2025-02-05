module.exports = (sequelize, DataTypes) => {
    const sites = sequelize.define("db_sites",
        {
            site_id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },

            site_code: {
                type: DataTypes.STRING,
                allowNull: true,
            },

            acc_id: {
                type: DataTypes.INTEGER,
                allowNull: true,
                references: {
                    model: 'db_accounts',
                    key: 'acc_id',
                }
            },

            site_cat_id: {
                type: DataTypes.INTEGER,
                allowNull: true,
                references: {
                    model: 'db_site_categories',
                    key: 'site_cat_id',
                }
            },

            country_id: {
                type: DataTypes.INTEGER,
                allowNull: true,
                references: {
                    model: "db_countries",
                    key: "country_id",
                },
            },

            state_id: {
                type: DataTypes.INTEGER,
                allowNull: true,
                references: {
                    model: "db_states",
                    key: "state_id",
                },
            },

            city_id: {
                type: DataTypes.INTEGER,
                allowNull: true,
                references: {
                    model: "db_cities",
                    key: "city_id",
                },
            },

            location: {
                type: DataTypes.TEXT,
                allowNull: true,
            },

            m_f_id: {
                type: DataTypes.INTEGER,
                allowNull: true,
                references: {
                    model: 'db_media_formats',
                    key: 'm_f_id',
                }
            },

            m_v_id: {
                type: DataTypes.INTEGER,
                allowNull: true,
                references: {
                    model: 'db_media_vehicles',
                    key: 'm_v_id',
                }
            },

            m_t_id: {
                type: DataTypes.INTEGER,
                allowNull: true,
                references: {
                    model: 'db_media_types',
                    key: 'm_t_id',
                }
            },

            s_s_id: {
                type: DataTypes.INTEGER,
                allowNull: true,
                references: {
                    model: 'db_site_statuses',
                    key: 's_s_id',
                }
            },

            rating_id: {
                type: DataTypes.INTEGER,
                allowNull: true,
                references: {
                    model: 'db_ratings',
                    key: 'rating_id',
                }
            },

            a_s_id: {
                type: DataTypes.INTEGER,
                allowNull: true,
                references: {
                    model: 'db_availabilty_statuses',
                    key: 'a_s_id',
                }
            },

            traffic_from: {
                type: DataTypes.TEXT,
                allowNull: true,
            },

            traffic_to: {
                type: DataTypes.TEXT,
                allowNull: true,
            },

            position_of_site: {
                type: DataTypes.TEXT,
                allowNull: true,
            },

            lat_long: {
                type: DataTypes.TEXT,
                allowNull: true,
            },

            available_from: {
                type: DataTypes.DATE,
                allowNull: true,
            },

            available_to: {
                type: DataTypes.DATE,
                allowNull: true,
            },

            remarks: {
                type: DataTypes.TEXT,
                allowNull: true,
            },

            lease_from: {
                type: DataTypes.DATE,
                allowNull: true,
            },

            lease_to: {
                type: DataTypes.DATE,
                allowNull: true,
            },

            lease_period: {
                type: DataTypes.TEXT,
                allowNull: true,
            },

            lease_cost: {                          //per month
                type: DataTypes.INTEGER,
                allowNull: true,
            },

            height: {
                type: DataTypes.INTEGER(50),
                allowNull: true,
            },

            width: {
                type: DataTypes.INTEGER(50),
                allowNull: true,
            },

            quantity: {
                type: DataTypes.INTEGER(50),
                allowNull: true,
            },

            selling_cost: {                        //per month
                type: DataTypes.INTEGER,
                allowNull: true,
            },

            buying_cost: {                         //per month
                type: DataTypes.INTEGER,
                allowNull: true,
            },

            leased_cost: {                         //per month
                type: DataTypes.INTEGER,
                allowNull: true,
            },

            card_rate: {                           //per month
                type: DataTypes.INTEGER,
                allowNull: true,
            },

            p_close_shot: {
                type: DataTypes.TEXT,
                allowNull: true,
            },

            p_long_shot: {
                type: DataTypes.TEXT,
                allowNull: true,
            },

            p_night_shot: {
                type: DataTypes.TEXT,
                allowNull: true,
            },

            created_by: {
                type: DataTypes.INTEGER,
                allowNull: true,
                references: {
                    model: 'db_users',
                    key: 'user_id',
                }
            },
            last_updated_by: {
                type: DataTypes.INTEGER,
                allowNull: true,
                references: {
                    model: 'db_users',
                    key: 'user_id',
                }
            },
        },
        { paranoid: true, timestamps: true },
    );


    return sites;
};

