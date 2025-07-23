const { fetchApi } = require("../models/api.model");

exports.getApi = async (req, res) => {
  const api = await fetchApi();
  res.send({ endpoints: api });
};
