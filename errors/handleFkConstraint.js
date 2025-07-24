exports.handleFkConstraint = (err, req, res, next) => {
  err.code === "23503" && err.constraint === "comments_author_fkey"
    ? res
        .status(400)
        .send({ msg: "400 Bad Request: must be a user to comment" })
    : next(err);
};
