const { format, createLogger, transports } = require("winston");
const config = require("../config/config");
const CloudWatchTransport = require("../helpers/cloudwatch-transport");
const { timestamp, combine, errors, json } = format;

function buildRazorpayLogger() {
  const transport = new CloudWatchTransport({
    logGroupName: config.cloudWatch.logGroupName,
    logStreamName: "razorpay-api",
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

module.exports = buildRazorpayLogger;
