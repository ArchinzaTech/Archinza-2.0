const buildDevLogger = require('./cloudwatch_dev_logger');
const buildProdLogger = require('./cloudwatch_prod_logger');
const config = require("../config/config");

let logger = null;
if (config.app_mode === 'production') {
  logger = buildProdLogger();
} else {
  logger = buildDevLogger();
}

module.exports = logger;