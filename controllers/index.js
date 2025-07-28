const { getApi } = require("./api.controller");
const { getTopics, postTopic } = require("./topics.controllers");
const { getUsers, getUserByUsername } = require("./users.controllers");
const {
  getArticles,
  getArticleById,
  getCommentsByArticle,
  postComment,
  patchArticleVotes,
  postArticle,
} = require("./articles.controllers");
const { removeComment, patchCommentVotes } = require("./comments.controllers");

module.exports = {
  getApi,
  getTopics,
  getUsers,
  getUserByUsername,
  getArticles,
  getArticleById,
  getCommentsByArticle,
  postComment,
  patchArticleVotes,
  removeComment,
  patchCommentVotes,
  postArticle,
  postTopic,
};
