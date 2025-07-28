const {
  fetchArticles,
  fetchArticleById,
  fetchCommentsByArticle,
  insertComment,
  updateVotes,
  insertArticle,
  deleteArticle,
} = require("../models/articles.models");

exports.getArticles = async ({ query }, res) => {
  const articles = await fetchArticles(query);
  res.send({ total_count: articles.length, articles });
};

exports.getArticleById = async ({ params: { article_id } }, res) => {
  const article = await fetchArticleById(article_id);
  res.send({ article });
};

exports.getCommentsByArticle = async (
  { params: { article_id }, query },
  res
) => {
  const comments = await fetchCommentsByArticle(article_id, query);
  res.send({ comments });
};

exports.postComment = async ({ params: { article_id }, body }, res) => {
  const comment = await insertComment(article_id, body);
  res.send({ comment });
};

exports.patchArticleVotes = async (
  { params: { article_id }, body: { inc_votes } },
  res
) => {
  const article = await updateVotes(article_id, inc_votes);
  res.send({ article });
};

exports.postArticle = async ({ body }, res) => {
  const article = await insertArticle(body);
  res.send({ article });
};

exports.removeArticle = async ({ params: { article_id } }, res) => {
  const article = await deleteArticle(article_id);
  return article
    ? res.status(204).send()
    : Promise.reject({ status: 404, msg: "404 Not Found" });
};
