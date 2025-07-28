exports.handleBadRequest = (err, req, res, next) => {
  err.code === "22P02" ||
  err.code === "23502" ||
  err.code === "23503" ||
  err.code === "23505"
    ? res.status(400).send({ msg: "400 Bad Request" })
    : next(err);
};
