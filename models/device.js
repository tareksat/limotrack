const { DataTypes } = require("sequelize");
const sequelize = require("../utils/database");

const Device = sequelize.define(
    "Device", {
        device_id: {
            primaryKey: true,
            type: DataTypes.INTEGER,
            allowNull: false,
            autoIncrement: true,
        },
        imei: DataTypes.STRING,
        device_type_id: DataTypes.INTEGER,
        subscription: DataTypes.DATE,
    }, {
        tableName: "devices",
    }
);

module.exports = Device;