const {
  fetchArticles,
  fetchArticleById,
  fetchCommentsOnArticle,
  postComment,
  updateVotes,
} = require("../models/articles.models");

exports.getArticles = async ({ query }, res) => {
  const articles = await fetchArticles(query);
  res.send({ articles });
};

exports.getArticleById = async ({ params: { article_id } }, res) => {
  const article = await fetchArticleById(article_id);
  res.send({ article });
};

exports.getCommentsOnArticle = async ({ params: { article_id } }, res) => {
  const comments = await fetchCommentsOnArticle(article_id);
  res.send({ comments });
};

exports.postComment = async ({ params: { article_id }, body }, res) => {
  const comment = await postComment(article_id, body);
  res.send({ comment });
};

exports.patchArticle = async (
  { params: { article_id }, body: { inc_votes } },
  res
) => {
  const article = await updateVotes(article_id, inc_votes);
  res.send({ article });
};
