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
        latitude: DataTypes.STRING,
        latitude_level: DataTypes.STRING,
        longitude: DataTypes.STRING,
        longitude_level: DataTypes.STRING,
        speed: DataTypes.INTEGER,
        acc_state: DataTypes.TINYINT(1),
        door_state: DataTypes.TINYINT(1),
        fuel_level: DataTypes.FLOAT,
        temperature: DataTypes.FLOAT,
        keyword: DataTypes.STRING,
        fuel_consumption: DataTypes.FLOAT,
        distance: DataTypes.FLOAT,
        created_at: DataTypes.DATE,
    }, {
        tableName: "tk303",
    }
);

module.exports = TK303;