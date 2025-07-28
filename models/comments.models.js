const db = require("../db/connection");

exports.deleteComment = async (id) => {
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

exports.updateVotes = async (id, inc_votes) => {
  const { rows: comments } = await db.query(
    `
    UPDATE comments
    SET votes = votes + $1
    WHERE comment_id = $2
    RETURNING *;
    `,
    [inc_votes, id]
  );
  return comments[0];
};
