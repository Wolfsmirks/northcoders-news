const { deleteComment, updateVotes } = require("../models/comments.models");

exports.removeComment = async ({ params: { comment_id } }, res) => {
  const comment = await deleteComment(comment_id);
  return comment
    ? res.status(204).send()
    : Promise.reject({ status: 404, msg: "404 Not Found" });
};

exports.patchCommentVotes = async (
  { params: { comment_id }, body: { inc_votes } },
  res
) => {
  const comment = await updateVotes(comment_id, inc_votes);
  res.status(200).send({ comment });
};
