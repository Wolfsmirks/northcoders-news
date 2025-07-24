const db = require("../db/connection");

exports.fetchArticles = async () => {
  const { rows: articles } = await db.query(
    `
    SELECT 
      a.author,
      a.title, 
      a.article_id, 
      a.topic, 
      a.created_at, 
      a.votes, 
      a.article_img_url, 
      COUNT(c.comment_id)::INT AS comment_count
    FROM articles a
    LEFT JOIN comments c ON a.article_id = c.article_id
    GROUP BY a.article_id
    ORDER BY a.created_at DESC;
    `
  );
  return articles;
};

exports.fetchArticle = async (id) => {
  const { rows: article } = await db.query(
    `
    SELECT *
    FROM articles
    WHERE article_id = $1;
    `,
    [id]
  );
  return article[0] || Promise.reject({ status: 404, msg: "404 Not Found" });
};

exports.fetchCommentsOnArticle = async (id) => {
  const { rows: comments } = await db.query(
    `
    SELECT *
    FROM comments
    WHERE article_id = $1
    ORDER BY created_at DESC;
    `,
    [id]
  );
  return comments.length > 0
    ? comments
    : Promise.reject({ status: 404, msg: "404 Not Found" });
};
