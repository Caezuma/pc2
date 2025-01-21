const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('console_log', 'console-log', 'password', {
  host: 'localhost',
  dialect: 'postgres'
});

module.exports = sequelize;
