const { removeComment } = require("../models/comments.models");

exports.deleteComment = async ({ params: { comment_id } }, res) => {
  const comment = await removeComment(comment_id);
  if (comment) return res.status(204).send();
};
