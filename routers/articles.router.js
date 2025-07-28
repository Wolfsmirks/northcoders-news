const articlesRouter = require("express").Router();
const {
  getArticles,
  getArticleById,
  getCommentsByArticle,
  postComment,
  patchArticleVotes,
  postArticle,
  removeArticle,
} = require("../controllers");

articlesRouter.get("/", getArticles);
articlesRouter.post("/", postArticle);

articlesRouter.get("/:article_id", getArticleById);
articlesRouter.patch("/:article_id", patchArticleVotes);
articlesRouter.delete("/:article_id", removeArticle);

articlesRouter.get("/:article_id/comments", getCommentsByArticle);
articlesRouter.post("/:article_id/comments", postComment);

module.exports = articlesRouter;
