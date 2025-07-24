const { getApi, getTopics, getArticles } = require("./controllers");
const express = require("express");
const app = express();

app.get("/api", getApi);
app.get("/api/topics", getTopics);
app.get("/api/articles", getArticles);

module.exports = app;
