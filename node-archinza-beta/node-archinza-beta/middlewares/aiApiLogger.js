const buildApiLogger = require("../logger/ai_logger");
const ApiLogger = buildApiLogger();
module.exports = (req, res, next) => {
  const { method, url, params, body, rawHeaders, baseUrl, ip, query } = req;

  const requestLog = {
    // timestamp: new Date().toISOString(),
    method,
    url,
    params,
    body,
    rawHeaders,
    baseUrl,
    ip,
    query,
  };

  // console.log('Request', requestLog);
  // ApiLogger.info('Request',{request:requestLog});

  // Capture the original send function
  const originalSend = res.send;

  // Overwrite the send function to log the response
  res.send = function (body) {
    if (typeof body === "object") {
      ApiLogger.info("AI API", {
        request: requestLog,
        response: { body, statusCode: res.statusCode },
      });
    }

    originalSend.apply(res, arguments);
  };

  next();
};
