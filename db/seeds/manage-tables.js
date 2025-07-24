const db = require("../../db/connection");
const format = require("pg-format");

exports.dropTables = async (...tables) => {
  let query = "";
  tables.forEach((table) => (query += `DROP TABLE IF EXISTS ${table};\n`));
  return await db.query(query);
};

exports.insertData = async (table, data, ...columns) => {
  const sql =
    columns.length > 0
      ? format(
          `INSERT INTO %I (%I) VALUES %L RETURNING *;`,
          table,
          columns,
          data
        )
      : format(`INSERT INTO %I VALUES %L RETURNING *;`, table, data);

  return await db.query(sql);
};

exports.createTopics = async () => {
  return await db.query(`
    CREATE TABLE topics (
      description VARCHAR,
      slug VARCHAR PRIMARY KEY,
      img_url VARCHAR(1000)
    )
    `);
};

exports.createUsers = async () => {
  return await db.query(`
    CREATE TABLE users (
      username VARCHAR PRIMARY KEY,
      name VARCHAR,
      avatar_url VARCHAR(1000)
    )
    `);
};

exports.createArticles = async () => {
  return await db.query(`
    CREATE TABLE articles (
      article_id SERIAL PRIMARY KEY,
      title VARCHAR,
      topic VARCHAR REFERENCES topics(slug),
      author VARCHAR REFERENCES users(username),
      body TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      votes INT DEFAULT 0,
      article_img_url VARCHAR(1000)
    )
    `);
};

exports.createComments = async () => {
  return await db.query(`
    CREATE TABLE comments (
      comment_id SERIAL PRIMARY KEY,
      article_id INT REFERENCES articles(article_id),
      body TEXT NOT NULL,
      votes INT DEFAULT 0,
      author VARCHAR REFERENCES users(username) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
    `);
};

exports.createEmojis = async () => {
  return await db.query(`
    CREATE TABLE emojis (
      emoji_id SERIAL PRIMARY KEY,
      emoji VARCHAR NOT NULL
    )
    `);
};

exports.createEmojiBridge = async () => {
  return await db.query(`
    CREATE TABLE emojis_article_users (
      emoji_article_user_id SERIAL PRIMARY KEY,
      emoji_id INT REFERENCES emojis(emoji_id),
      username VARCHAR REFERENCES users(username),
      article_id INT REFERENCES articles(article_id),
      UNIQUE (emoji_id, username, article_id)
    )
    `);
};

exports.createFollowBridge = async () => {
  return await db.query(`
    CREATE TABLE user_topic (
      user_topic_id SERIAL PRIMARY KEY,
      username VARCHAR REFERENCES users(username),
      topic VARCHAR REFERENCES topics(slug),
      UNIQUE (username, topic)
    )
    `);
};

exports.createVotesBridge = async () => {
  return await db.query(`
    CREATE TABLE user_article_votes (
      user_article_votes_id SERIAL PRIMARY KEY,
      username VARCHAR REFERENCES users(username),
      article_id INT REFERENCES articles(article_id),
      vote_count INT NOT NULL,
      UNIQUE (username, article_id)
    )
    `);
};
