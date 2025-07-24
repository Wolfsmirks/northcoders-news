const {
  getApi,
  getTopics,
  getArticles,
  getUsers,
  getArticle,
} = require("./controllers");
const { handleBadRequest, handleNotFound } = require("./errors");

const express = require("express");
const app = express();

app.get("/api", getApi);
app.get("/api/topics", getTopics);
app.get("/api/articles", getArticles);
app.get("/api/users", getUsers);
app.get("/api/articles/:article_id", getArticle);

app.use(handleBadRequest);
app.use(handleNotFound);

module.exports = app;
