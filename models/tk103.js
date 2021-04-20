const { DataTypes } = require("sequelize");
const sequelize = require("../utils/database");
const Sequelize = require('sequelize');

const TK103 = sequelize.define(
    "TK103", {
        id: {
            primaryKey: true,
            type: DataTypes.INTEGER,
            allowNull: false,
            autoIncrement: true,
        },
        imei: DataTypes.STRING,
        time: DataTypes.DATE,
        gps_signal: DataTypes.STRING,
        gps_status: DataTypes.STRING,
        gmt_time: DataTypes.STRING,
        latitude: {type: DataTypes.STRING, allowNull: true},
        latitude_level: DataTypes.STRING,
        longitude: DataTypes.STRING,
        longitude_level: DataTypes.STRING,
        speed: {type: DataTypes.INTEGER, allowNull: true},
        fuel_level: {type: DataTypes.FLOAT, allowNull: true},
        keyword: DataTypes.STRING,
        created_at: {type: DataTypes.DATE, defaultValue: Sequelize.NOW},
    }, {
        tableName: "tk103",
    }
);

module.exports = TK103;