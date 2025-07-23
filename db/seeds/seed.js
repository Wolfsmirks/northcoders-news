const db = require("../connection");
const { formatData, generateLookup } = require("./utils");
const {
  dropTables,
  insertData,
  createTopics,
  createUsers,
  createArticles,
  createComments,
  createEmojis,
  createEmojiBridge,
  createFollowBridge,
  createVotesBridge,
} = require("./manage-tables");

const seed = async ({
  topicData,
  userData,
  articleData,
  commentData,
  emojiData,
}) => {
  try {
    await dropTables(
      "user_article_votes",
      "user_topic",
      "emojis_article_users",
      "emojis",
      "comments",
      "articles",
      "users",
      "topics"
    );

    await createTopics();
    await createUsers();
    await createArticles();
    await createComments();
    await createEmojis();
    await createEmojiBridge();
    await createFollowBridge();
    await createVotesBridge();

    await insertData("topics", formatData(topicData));
    await insertData("users", formatData(userData));

    const { rows } = await insertData(
      "articles",
      formatData(articleData),
      "title",
      "topic",
      "author",
      "body",
      "created_at",
      "votes",
      "article_img_url"
    );

    const lookup = generateLookup(rows, "title", "article_id");
    const fixedCommentsData = commentData.map(({ article_title, ...rest }) => {
      return {
        article_id: lookup[article_title],
        ...rest,
      };
    });

    await insertData(
      "comments",
      formatData(fixedCommentsData),
      "article_id",
      "body",
      "votes",
      "author",
      "created_at"
    );

    await insertData("emojis", formatData(emojiData), "emoji");
  } catch (err) {
    return err;
  }
};

module.exports = seed;
