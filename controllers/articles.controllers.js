const { fetchArticles } = require("../models/articles.models");

exports.getArticles = async (req, res) => {
  const articles = await fetchArticles();
  res.send({ articles });
};
