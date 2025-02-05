module.exports = (sequelize, DataTypes) => {
    const estimationAgencyBusiness = sequelize.define("db_sites_agencies", // database table name
        {
            site_id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },

            estimate_id: {
                type: DataTypes.INTEGER,
                allowNull: true,
                references: {
                    model: "db_estimates",
                    key: "estimate_id",
                },
            },

            site_code: {
                type: DataTypes.STRING,
                allowNull: true,
            },

            country_id: {
                type: DataTypes.STRING,
                allowNull: true,
            },

            state_id: {
                type: DataTypes.STRING,
                allowNull: true,
            },

            city_id: {
                type: DataTypes.STRING,
                allowNull: true,
            },

            location: {
                type: DataTypes.TEXT,
                allowNull: true,
            },

            m_f_id: {
                type: DataTypes.STRING,
                allowNull: true,
            },

            m_v_id: {
                type: DataTypes.STRING,
                allowNull: true,
            },

            m_t_id: {
                type: DataTypes.STRING,
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

            client_display_cost: {      //per sq. ft.
                type: DataTypes.INTEGER,
                allowNull: true,
            },

            client_mounting_cost: {     //per sq. ft.
                type: DataTypes.INTEGER,
                allowNull: true,
            },

            client_printing_cost: {      //per sq. ft.
                type: DataTypes.INTEGER,
                allowNull: true,
            },

            start_date: {
                type: DataTypes.DATEONLY,
                allowNull: true,
            },

            end_date: {
                type: DataTypes.DATEONLY,
                allowNull: true,
            },

            duration: {
                type: DataTypes.INTEGER,
                allowNull: true,
            },

            status: {
                type: DataTypes.BOOLEAN,
                default: true,
            },
        },
        { paranoid: true, timestamps: true },
    );


    return estimationAgencyBusiness;
};

