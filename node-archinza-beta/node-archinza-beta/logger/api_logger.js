const { format, createLogger, transports } = require("winston");
const { timestamp, combine, errors, json } = format;
const CloudWatchTransport = require("../helpers/cloudwatch-transport");
const config = require("../config/config");

function buildApiLogger() {
  const transport = new CloudWatchTransport({
    logGroupName: config.cloudWatch.logGroupName,
    logStreamName: "bot-api",
    awsConfig: {
      accessKeyId: config.aws_access_key_id,
      secretAccessKey: config.aws_secret_access_key,
      region: config.aws_region,
    },
  });
  return createLogger({
    format: combine(timestamp(), errors({ stack: true }), json()),
    // defaultMeta: { service: 'user-service' },
    transports: [transport],
  });
}

module.exports = buildApiLogger;
