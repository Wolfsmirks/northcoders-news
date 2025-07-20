const db = require("./connection");

const runQueries = async () => {
  try {
    const users = {
      text: "SELECT * FROM users;",
      rowMode: "array",
    };
    const codingArticles = {
      text: "SELECT * FROM articles WHERE topic = 'coding';",
      rowMode: "array",
    };
    const negativeComments = {
      text: "SELECT * FROM comments WHERE votes < 0;",
      rowMode: "array",
    };
    const topics = {
      text: "SELECT * FROM topics;",
      rowMode: "array",
    };
    const userArticles = {
      text: "SELECT * FROM articles WHERE author = 'grumpy19';",
      rowMode: "array",
    };
    const tenPlusVotes = {
      text: "SELECT * FROM comments WHERE votes > 10;",
      rowMode: "array",
    };
    return await Promise.all([
      db.query(users),
      db.query(codingArticles),
      db.query(negativeComments),
      db.query(topics),
      db.query(userArticles),
      db.query(tenPlusVotes),
    ]);
  } catch (err) {
    console.log(err);
  }
};

runQueries().then((responses) => {
  responses.forEach((res) => console.log(res.rows));
});
