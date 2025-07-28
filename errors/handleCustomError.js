exports.handleCustomError = (err, req, res, next) => {
  err.status && err.msg
    ? res.status(err.status).send({ msg: err.msg })
    : next(err);
};
