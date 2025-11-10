const { createLogger, format, transports } = require('winston');
const CloudWatchTransport = require('../helpers/cloudwatch-transport');
const config = require('../config/config');

const buildProdLogger = () => {
  const prodTransports = [];

  if (config.cloudWatch && config.cloudWatch.logGroupName && config.cloudWatch.logStreamName) {
    prodTransports.push(
      new CloudWatchTransport({
        name: 'CloudWatch',
        logGroupName: config.cloudWatch.logGroupName,
        logStreamName: config.cloudWatch.logStreamName,
        awsConfig: config.cloudWatch.awsConfig,
      })
    );
  }

  return createLogger({
    level: 'info',
    format: format.json(),
    transports: prodTransports,
  });
};

module.exports = buildProdLogger;