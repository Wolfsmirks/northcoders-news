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
