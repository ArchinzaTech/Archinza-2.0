const jwt = require("jsonwebtoken");

const config = require("../config/config");
const { sendResponse, sendError, validator } = require("../helpers/api");

module.exports = (req, res, next) => {
  let token = req.header("Authorization");
  if (!token) {
    return res.send(sendError("Unauthorized", 401));
  }
  token = token.split(" ");

  // verify token
  try {
    const decoded = jwt.verify(token[1], config.secretkey);
    req.auth = decoded;
    next();
  } catch (error) {
    res.send(sendError("Invalid Token", 400));
  }
};
