const db = require("../db/connection");

exports.fetchUsers = async () => {
  const { rows: users } = await db.query(
    `
    SELECT *
    FROM users;
    `
  );
  return users;
};

exports.fetchUserByUsername = async (username) => {
  const { rows: users } = await db.query(
    `
    SELECT *
    FROM users
    WHERE username = $1;
    `,
    [username]
  );
  return users[0] || Promise.reject({ status: 404, msg: "404 Not Found" });
};
