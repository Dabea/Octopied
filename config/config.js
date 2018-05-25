const path = require('path');
require('dotenv').config();

module.exports = {
  "development": {
    "username": "root",
    "password": process.env.PASSWORD,
    "database": "octopied_db",
    "host": process.env.HOST,
    "dialect": "mysql"
  },
  "test": {
    "username": "root",
    "password": null,
    "database": "database_test",
    "host": "127.0.0.1",
    "dialect": "mysql"
  },
  "production": {
    "username": "",
    "password": "",
    "database": "",
    "host": "",
    "dialect": "mysql"
  }
}