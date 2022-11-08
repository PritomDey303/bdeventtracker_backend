const createError = require("http-errors");

// 404 not found handler
function notFoundHandler(req, res, next) {
  next(createError(404, "Your requested content was not found!"));
}

// default error handler
function errorHandler(err, req, res, next) {
  //console.log(err.message);
  res.json({
    status: 500,
    message: err.message,
  });
}

module.exports = {
  notFoundHandler,
  errorHandler,
};
