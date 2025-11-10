const { createLogger, format, transports } = require("winston");

const buildInfoLogger = () => {
  return createLogger({
    level: "info",
    format: format.combine(
      format.colorize(),
      format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
      format.printf((info) => `${info.level}: ${info.message}`)
    ),
    transports: [new transports.Console()],
  });
};

module.exports = buildInfoLogger();
