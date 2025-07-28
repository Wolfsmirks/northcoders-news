const { handleBadRequest } = require("./handleBadRequest");
const { handleCustomError } = require("./handleCustomError");
const { handleServerError } = require("./handleServerError");

module.exports = { handleBadRequest, handleCustomError, handleServerError };
