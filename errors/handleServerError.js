exports.handleServerError = (err, req, res, next) => {
  res.status(500).send({ msg: "500 Internal Server Error" });
};
