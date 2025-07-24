const db = require("../db/connection.js");
const seed = require("../db/seeds/seed.js");
const data = require("../db/data/test-data");
const app = require("../app.js");
const endpointsJson = require("../endpoints.json");
const request = require("supertest");
const articles = require("../db/data/test-data/articles.js");

beforeEach(() => seed(data));
afterAll(() => db.end());

describe("GET /api", () => {
  it("200: responds with an object detailing the documentation for each endpoint", async () => {
    const {
      body: { endpoints },
    } = await request(app).get("/api").expect(200);
    expect(endpoints).toEqual(endpointsJson);
  });
});
describe("GET /api/topics", () => {
  it("200: responds with an array of topic objects", async () => {
    const {
      body: { topics },
    } = await request(app).get("/api/topics").expect(200);
    expect(topics).toEqual(data.topicData);
  });
});
describe("GET /api/articles", () => {
  it("200: responds with an array of article objects, sorted by most recent", async () => {
    const {
      body: { articles },
    } = await request(app).get("/api/articles").expect(200);

    articles.forEach((article) => {
      expect(article).toEqual(
        expect.objectContaining({
          article_id: expect.any(Number),
          title: expect.any(String),
          topic: expect.any(String),
          author: expect.any(String),
          created_at: expect.any(String),
          votes: expect.any(Number),
          article_img_url: expect.any(String),
          comment_count: expect.any(Number),
        })
      );
    });

    const sortedArticles = [...articles].sort((a, b) => {
      return new Date(b.created_at) - new Date(a.created_at);
    });
    expect(articles).toEqual(sortedArticles);
  });
});
describe("GET /api/users", () => {
  it("200: responds with an array of user objects", async () => {
    const {
      body: { users },
    } = await request(app).get("/api/users").expect(200);
    expect(users).toEqual(data.userData);
  });
});
describe("GET /api/articles/:article_id", () => {
  it("200: responds with the specified article object", async () => {
    const {
      body: { article },
    } = await request(app).get("/api/articles/1").expect(200);

    expect(article).toEqual(
      expect.objectContaining({
        article_id: 1,
        title: "Living in the shadow of a great man",
        topic: "mitch",
        author: "butter_bridge",
        body: "I find this existence challenging",
        created_at: "2020-07-09T20:11:00.000Z",
        votes: 100,
        article_img_url:
          "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
      })
    );
  });
  it("400: responds with an error message when article_id is invalid", async () => {
    const { body: err } = await request(app)
      .get("/api/articles/NaN")
      .expect(400);
    expect(err).toEqual({ msg: "400 Bad Request" });
  });
  it("404: responds with an error message when the specified article doesn't exist", async () => {
    const { body: err } = await request(app)
      .get("/api/articles/9999")
      .expect(404);
    expect(err).toEqual({ msg: "404 Not Found" });
  });
});
describe("GET /api/articles/:article_id/comments", () => {
  it("200: responds with an array of comment objects from the specified article, sorted by most recent", async () => {
    const {
      body: { comments },
    } = await request(app).get("/api/articles/1/comments").expect(200);

    comments.forEach((comment) => {
      expect(comment).toEqual(
        expect.objectContaining({
          comment_id: expect.any(Number),
          article_id: expect.any(Number),
          body: expect.any(String),
          votes: expect.any(Number),
          author: expect.any(String),
          created_at: expect.any(String),
        })
      );
    });

    const sortedComments = [...comments].sort((a, b) => {
      return new Date(b.created_at) - new Date(a.created_at);
    });
    expect(comments).toEqual(sortedComments);
  });
  it("400: responds with an error message when article_id is invalid", async () => {
    const { body: err } = await request(app)
      .get("/api/articles/NaN/comments")
      .expect(400);
    expect(err).toEqual({ msg: "400 Bad Request" });
  });
  it("404: responds with an error message when the specified article doesn't exist", async () => {
    const { body: err } = await request(app)
      .get("/api/articles/9999/comments")
      .expect(404);
    expect(err).toEqual({ msg: "404 Not Found" });
  });
});
