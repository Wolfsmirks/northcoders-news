const {
  getApi,
  getTopics,
  getArticles,
  getUsers,
  getArticle,
  getCommentsOnArticle,
  postComment,
} = require("./controllers");
const {
  handleBadRequest,
  handleNotFound,
  handleFkConstraint,
} = require("./errors");

const express = require("express");
const app = express();
app.use(express.json());

app.get("/api", getApi);
app.get("/api/topics", getTopics);
app.get("/api/articles", getArticles);
app.get("/api/users", getUsers);
app.get("/api/articles/:article_id", getArticle);
app.get("/api/articles/:article_id/comments", getCommentsOnArticle);

app.post("/api/articles/:article_id/comments", postComment);

app.use(handleFkConstraint);
app.use(handleBadRequest);
app.use(handleNotFound);

module.exports = app;
