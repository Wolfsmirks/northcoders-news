const db = require("../db/connection");
const format = require("pg-format");

exports.fetchArticles = async ({
  sort_by = "created_at",
  order = "DESC",
  filter_by,
  topic,
  limit = 10,
  page = 1,
}) => {
  const validColumns = [
    "article_id",
    "title",
    "topic",
    "author",
    "created_at",
    "votes",
    "article_img_url",
  ];
  const validOrders = ["asc", "desc", "ASC", "DESC"];

  if (
    !validColumns.includes(sort_by) ||
    !validOrders.includes(order) ||
    (filter_by && !validColumns.includes(filter_by)) ||
    isNaN(limit) ||
    limit <= 0 ||
    isNaN(page) ||
    page <= 0
  )
    return Promise.reject({ status: 400, msg: "400 Bad Request" });

  let filter = "";
  if (validColumns.includes(filter_by) && topic) {
    filter = format(
      `
      WHERE a.%I = %L
      `,
      filter_by,
      topic
    );
  }

  const offset = (page - 1) * limit;

  const { rows: articles } = await db.query(
    format(
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
      %s
      GROUP BY a.article_id 
      ORDER BY a.%I %s
      LIMIT %L OFFSET %L;
      `,
      filter,
      sort_by,
      order,
      limit,
      offset
    )
  );
  return articles;
};

exports.fetchArticleById = async (id) => {
  const { rows: article } = await db.query(
    `
    SELECT
      a.*,
      COUNT(c.comment_id)::INT AS comment_count
    FROM articles a
    LEFT JOIN comments c ON a.article_id = c.article_id
    WHERE a.article_id = $1
    GROUP BY a.article_id;
    `,
    [id]
  );
  return article[0] || Promise.reject({ status: 404, msg: "404 Not Found" });
};

exports.fetchCommentsByArticle = async (id, { limit = 10, page = 1 }) => {
  if (isNaN(limit) || limit <= 0 || isNaN(page) || page <= 0)
    return Promise.reject({ status: 400, msg: "400 Bad Request" });

  const offset = (page - 1) * limit;

  const { rows: comments } = await db.query(
    `
    SELECT *
    FROM comments
    WHERE article_id = $1
    ORDER BY created_at DESC
    LIMIT $2 OFFSET $3;
    `,
    [id, limit, offset]
  );
  return comments.length > 0
    ? comments
    : Promise.reject({ status: 404, msg: "404 Not Found" });
};

exports.insertComment = async (id, { body, username }) => {
  if (body && username) {
    const { rows: comments } = await db.query(
      `
      INSERT INTO comments (article_id, body, author)
      VALUES ($1, $2, $3)
      RETURNING *;
      `,
      [id, body, username]
    );
    return comments[0];
  } else {
    return Promise.reject({
      status: 400,
      msg: "400 Bad Request: one or more fields are invalid.",
    });
  }
};

exports.updateVotes = async (id, inc_votes) => {
  const { rows: articles } = await db.query(
    `
    UPDATE articles
    SET votes = votes + $1
    WHERE article_id = $2
    RETURNING *;
    `,
    [inc_votes, id]
  );
  return articles[0];
};

exports.insertArticle = async (body) => {
  const validColumns = ["title", "topic", "author", "body", "article_img_url"];

  for (const key of Object.keys(body)) {
    if (!validColumns.includes(key)) {
      throw {
        status: 400,
        msg: "400 Bad Request",
      };
    }
  }

  if (body.article_img_url === undefined) body.article_img_url = null;

  const { rows: articles } = await db.query(
    `
    INSERT INTO articles (title, topic, author, body, article_img_url)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING *;
    `,
    [body.title, body.topic, body.author, body.body, body.article_img_url]
  );
  articles[0].comment_count = 0;
  return articles[0];
};
