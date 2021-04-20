const { DataTypes } = require("sequelize");
const sequelize = require("../utils/database");

const Data = sequelize.define(
    "Data", {
        id: {
            primaryKey: true,
            type: DataTypes.INTEGER,
            allowNull: false,
            autoIncrement: true,
        },
        data: DataTypes.STRING,
    }, {
        tableName: "data_log",
    }
);

module.exports = Data;