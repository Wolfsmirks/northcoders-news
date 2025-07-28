const articlesRouter = require("express").Router();
const {
  getArticles,
  getArticleById,
  getCommentsByArticle,
  postComment,
  patchArticleVotes,
  postArticle,
} = require("../controllers");

articlesRouter.get("/", getArticles);
articlesRouter.post("/", postArticle);

articlesRouter.get("/:article_id", getArticleById);
articlesRouter.patch("/:article_id", patchArticleVotes);

articlesRouter.get("/:article_id/comments", getCommentsByArticle);
articlesRouter.post("/:article_id/comments", postComment);

module.exports = articlesRouter;
