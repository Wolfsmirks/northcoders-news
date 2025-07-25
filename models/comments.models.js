const db = require("../db/connection");

exports.removeComment = async (id) => {
  const { rows: comments } = await db.query(
    `
    DELETE FROM comments
    WHERE comment_id = $1
    RETURNING *;
    `,
    [id]
  );
  return comments[0];
};
