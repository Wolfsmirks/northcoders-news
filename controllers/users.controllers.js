const { fetchUsers } = require("../models/users.models");

exports.getUsers = async (req, res) => {
  const users = await fetchUsers();
  res.send({ users });
};
