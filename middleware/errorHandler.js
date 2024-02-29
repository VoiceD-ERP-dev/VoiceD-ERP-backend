const { constants } = require("../constants");
const errorHandler = (err, req, res, next) => {
    const statusCode = res.statusCode ? res.statusCode : 500;
    switch (statusCode) {
        case constants.VALIDATION_ERROR:
          res.json({
            title: "Validation Failed",
            message: err.message,
            stackTrace: err.stack,
          });
          return; // Add return statement here
        case constants.NOT_FOUND:
          res.json({
            title: "Not Found",
            message: err.message,
            stackTrace: err.stack,
          });
          return; // Add return statement here
        case constants.UNAUTHORIZED:
          res.json({
            title: "Unauthorized",
            message: err.message,
            stackTrace: err.stack,
          });
          return; // Add return statement here
        case constants.FORBIDDEN:
          res.json({
            title: "Forbidden",
            message: err.message,
            stackTrace: err.stack,
          });
          return; // Add return statement here
        case constants.SERVER_ERROR:
          res.json({
            title: "Server Error",
            message: err.message,
            stackTrace: err.stack,
          });
          return; // Add return statement here
        default:
          console.log("No Error, All good !");
          break;
    }
};

module.exports = errorHandler;
