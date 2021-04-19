const { DataTypes } = require("sequelize");
const sequelize = require("../utils/database");

const TK303 = sequelize.define(
    "TK303", {
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
        acc_state: {type: DataTypes.TINYINT(1), allowNull: true},
        door_state: {type: DataTypes.TINYINT(1), allowNull: true},
        fuel_level: {type: DataTypes.FLOAT, allowNull: true},
        temperature: {type: DataTypes.FLOAT, allowNull: true},
        keyword: DataTypes.STRING,
        fuel_consumption: DataTypes.FLOAT,
        distance: DataTypes.FLOAT,
        created_at: DataTypes.DATE,
    }, {
        tableName: "tk303",
    }
);

module.exports = TK303;