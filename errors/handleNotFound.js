exports.handleNotFound = (err, req, res, next) => {
  err.status && err.msg
    ? res.status(err.status).send({ msg: err.msg })
    : res.status(500).send({ msg: "500 Internal Server Error" });
};
