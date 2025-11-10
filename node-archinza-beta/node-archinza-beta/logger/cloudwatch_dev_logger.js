const { createLogger, format, transports } = require('winston');
const CloudWatchTransport = require('../helpers/cloudwatch-transport');
const config = require('../config/config');

const buildDevLogger = () => {
  const devTransports = [
    new transports.Console({
      format: format.combine(
        format.colorize(),
        format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        format.printf(info => `${info.timestamp} ${info.level}: ${info.message}`)
      ),
    }),
  ];

  if (config.cloudWatch && config.cloudWatch.logGroupName && config.cloudWatch.logStreamName) {
    devTransports.push(
      new CloudWatchTransport({
        name: 'CloudWatch',
        logGroupName: config.cloudWatch.logGroupName,
        logStreamName: config.cloudWatch.logStreamName,
        awsConfig: config.cloudWatch.awsConfig,
      })
    );
  }

  return createLogger({
    level: 'debug',
    format: format.json(),
    transports: devTransports,
  });
};

module.exports = buildDevLogger;