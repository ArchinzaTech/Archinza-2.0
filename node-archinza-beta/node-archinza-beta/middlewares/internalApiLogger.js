const buildApiLogger = require("../logger/internal_api_logger");
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
  res.send = function (responseBody) {
    if (typeof responseBody === "object") {
      let bodyToLog = responseBody;
      if (req.path === "/get-file" && responseBody && responseBody.data) {
        bodyToLog = {
          ...responseBody,
          data: "File content not logged to avoid large logs.",
        };
      }
      ApiLogger.info("INTERNAL API", {
        request: requestLog,
        response: { body: bodyToLog, statusCode: res.statusCode },
      });
    }

    originalSend.apply(res, arguments);
  };

  next();
};
