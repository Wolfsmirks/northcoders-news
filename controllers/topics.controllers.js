const { fetchTopics, insertTopic } = require("../models/topics.models");

exports.getTopics = async (req, res) => {
  const topics = await fetchTopics();
  res.send({ topics });
};

exports.postTopic = async ({ body }, res) => {
  const topic = await insertTopic(body);
  res.send({ topic });
};
