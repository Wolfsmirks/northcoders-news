const commentsRouter = require("express").Router();
const { removeComment, patchCommentVotes } = require("../controllers");

commentsRouter.delete("/:comment_id", removeComment);
commentsRouter.patch("/:comment_id", patchCommentVotes);

module.exports = commentsRouter;
