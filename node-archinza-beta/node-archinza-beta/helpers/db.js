const mongoose = require("mongoose");
const config = require("../config/config");
const logger = require("../logger");

const url = `mongodb://${config.database.host}:${config.database.port}/${config.database.name}?authSource=admin`;

try {
  mongoose.connect(url, {
    useNewUrlParser: true,
    user: config.database.username,
    pass: config.database.password,
  });
} catch (error) {
  logger.error(error.message);
}

module.exports = mongoose.connection;
