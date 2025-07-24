const {
  fetchArticles,
  fetchArticle,
  fetchCommentsOnArticle,
} = require("../models/articles.models");

exports.getArticles = async (req, res) => {
  const articles = await fetchArticles();
  res.send({ articles });
};

exports.getArticle = async ({ params: { article_id } }, res) => {
  const article = await fetchArticle(article_id);
  res.send({ article });
};

exports.getCommentsOnArticle = async ({ params: { article_id } }, res) => {
  const comments = await fetchCommentsOnArticle(article_id);
  res.send({ comments });
};
