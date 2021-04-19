const Sequelize = require("sequelize");

const sequelize = new Sequelize(
  process.env.DB_NAME, // database name
  process.env.DB_USER, // username
  process.env.DB_PASSWORD, // password
  {
    host: "localhost", // host name
    dialect: "mysql", // to work with mysql
    logging: false,
    define: {
      timestamps: false,
    },
  }
);

module.exports = sequelize;
