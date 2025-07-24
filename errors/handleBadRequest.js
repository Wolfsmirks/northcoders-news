exports.handleBadRequest = (err, req, res, next) => {
  err.code === "22P02"
    ? res.status(400).send({ msg: "400 Bad Request" })
    : next(err);
};
