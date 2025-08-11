const apiRouter = require("./routers/api.router");
const {
  handleBadRequest,
  handleCustomError,
  handleServerError,
} = require("./errors");
const express = require("express");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

app.use("/api", express.static("public"));
app.use("/api", apiRouter);

app.use(handleBadRequest);
app.use(handleCustomError);
app.use(handleServerError);

module.exports = app;
