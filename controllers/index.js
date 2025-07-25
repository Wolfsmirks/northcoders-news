exports.getApi = require("./api.controller").getApi;
exports.getTopics = require("./topics.controllers").getTopics;
exports.getArticles = require("./articles.controllers").getArticles;
exports.getUsers = require("./users.controllers").getUsers;
exports.getArticleById = require("./articles.controllers").getArticleById;
exports.getCommentsOnArticle =
  require("./articles.controllers").getCommentsOnArticle;
exports.postComment = require("./articles.controllers").postComment;
exports.patchArticle = require("./articles.controllers").patchArticle;
exports.deleteComment = require("./comments.controllers").deleteComment;
