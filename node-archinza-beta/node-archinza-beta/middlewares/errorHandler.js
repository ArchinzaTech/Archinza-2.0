const { sendError } = require("../helpers/api");

module.exports =(err, req, res, next) => {
  if (err) {
    // console.log(err);
    res.status(500).send(sendError(err.message, 500));
  }
  next();
};
