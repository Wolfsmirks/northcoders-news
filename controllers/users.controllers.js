const { fetchUsers, fetchUserByUsername } = require("../models/users.models");

exports.getUsers = async (req, res) => {
  const users = await fetchUsers();
  res.send({ users });
};

exports.getUserByUsername = async ({ params: { username } }, res) => {
  const user = await fetchUserByUsername(username);
  res.send({ user });
};
