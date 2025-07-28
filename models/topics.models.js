const db = require("../db/connection.js");

exports.fetchTopics = async () => {
  const { rows: topics } = await db.query(
    `
    SELECT * 
    FROM topics;
    `
  );
  return topics;
};

exports.insertTopic = async ({ description, slug, img_url = null }) => {
  const { rows: topics } = await db.query(
    `
      INSERT INTO topics (description, slug, img_url)
      VALUES ($1, $2, $3)
      RETURNING *;
      `,
    [description, slug, img_url]
  );
  return topics[0];
};
