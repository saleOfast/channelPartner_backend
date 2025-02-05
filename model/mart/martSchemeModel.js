const { Sequelize, DataTypes } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    const Scheme = sequelize.define('db_mart_scheme', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        name: {
            type: DataTypes.STRING,
            allowNull: true
        },
        month: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        year: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        file: {
            type: DataTypes.STRING,
            allowNull:true
        },
        is_enable: {
            type: DataTypes.BOOLEAN,
            defaultValue: true
        },
    }, {
        paranoid: true, 
        timestamps: true 
    });

    return Scheme;
};
