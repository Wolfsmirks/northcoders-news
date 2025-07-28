const db = require("../db/connection.js");
const seed = require("../db/seeds/seed.js");
const data = require("../db/data/test-data");
const app = require("../app.js");
const endpointsJson = require("../endpoints.json");
const request = require("supertest");

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
describe("topic endpoints", () => {
  describe("GET /api/topics", () => {
    it("200: responds with an array of topic objects", async () => {
      const {
        body: { topics },
      } = await request(app).get("/api/topics").expect(200);
      expect(topics).toEqual(data.topicData);
    });
  });
});
describe("user endpoints", () => {
  describe("GET /api/users", () => {
    it("200: responds with an array of user objects", async () => {
      const {
        body: { users },
      } = await request(app).get("/api/users").expect(200);
      expect(users).toEqual(data.userData);
    });
  });
  describe("GET /api/users/:username", () => {
    it("200: responds with the specified user object", async () => {
      const {
        body: { user },
      } = await request(app).get("/api/users/butter_bridge").expect(200);
      expect(user).toEqual({
        username: "butter_bridge",
        name: "jonny",
        avatar_url:
          "https://www.healthytherapies.com/wp-content/uploads/2016/06/Lime3.jpg",
      });
    });
    it("404: responds with an error message when the specified user doesn't exist", async () => {
      const { body: err } = await request(app)
        .get("/api/users/invalid_username")
        .expect(404);
      expect(err).toEqual({ msg: "404 Not Found" });
    });
  });
});
describe("article endpoints", () => {
  describe("GET /api/articles", () => {
    it("200: responds with an array of article objects in descending order (most recent first)", async () => {
      const {
        body: { articles },
      } = await request(app).get("/api/articles").expect(200);
      expect(articles.length).toBeGreaterThan(0);
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
      expect(articles).toBeSortedBy("created_at", { descending: true });
    });
  });
  describe("GET /api/articles?sort_by", () => {
    it("200: responds with an array of article objects sorted by the specified column_name and order", async () => {
      const {
        body: { articles },
      } = await request(app)
        .get("/api/articles?sort_by=title&order=asc")
        .expect(200);
      expect(articles.length).toBeGreaterThan(0);
      expect(articles).toBeSorted({ key: "title" });
    });
    it("400: responds with an error message when the column_name is invalid", async () => {
      const { body: err } = await request(app)
        .get("/api/articles?sort_by=invalid_column&order=asc")
        .expect(400);
      expect(err).toEqual({ msg: "400 Bad Request" });
    });
    it("400: responds with an error message when the order is invalid", async () => {
      const { body: err } = await request(app)
        .get("/api/articles?sort_by=title&order=invalid_order")
        .expect(400);
      expect(err).toEqual({ msg: "400 Bad Request" });
    });
  });
  describe("GET /api/articles?filter_by", () => {
    it("200: responds with an array of article objects filtered by the specified column_name", async () => {
      const {
        body: { articles },
      } = await request(app)
        .get("/api/articles?filter_by=topic&topic=cats")
        .expect(200);
      expect(articles.length).toBeGreaterThan(0);
      articles.forEach((article) =>
        expect(article).toHaveProperty("topic", "cats")
      );
    });
    it("400: responds with an error message when the column_name is invalid", async () => {
      const { body: err } = await request(app)
        .get("/api/articles?filter_by=invalid_column&invalid_column=value")
        .expect(400);
      expect(err).toEqual({ msg: "400 Bad Request" });
    });
  });
  describe("GET /api/articles?limit", () => {
    it("200: responds with an array of article objects limited by the query values", async () => {
      const {
        body: { articles },
      } = await request(app).get("/api/articles?limit=2&page=2").expect(200);
      expect(articles.length).toBeGreaterThan(0);
      expect(articles).toEqual([
        {
          author: "icellusedkars",
          title: "Sony Vaio; or, The Laptop",
          article_id: 2,
          topic: "mitch",
          created_at: "2020-10-16T05:03:00.000Z",
          votes: 0,
          article_img_url:
            "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
          comment_count: 0,
        },
        {
          author: "butter_bridge",
          title: "Another article about Mitch",
          article_id: 13,
          topic: "mitch",
          created_at: "2020-10-11T11:24:00.000Z",
          votes: 0,
          article_img_url:
            "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
          comment_count: 0,
        },
      ]);
    });
    it("200: limit defaults to 10 when omitted", async () => {
      const {
        body: { articles },
      } = await request(app).get("/api/articles?page=1").expect(200);
      expect(articles).toHaveLength(10);
    });
    it("400: responds with an error message when the limit value is invalid", async () => {
      const { body: err } = await request(app)
        .get("/api/articles?limit=NaN&page=2")
        .expect(400);
      expect(err).toEqual({ msg: "400 Bad Request" });
    });
    it("400: responds with an error message when the page value is invalid", async () => {
      const { body: err } = await request(app)
        .get("/api/articles?limit=2&page=NaN")
        .expect(400);
      expect(err).toEqual({ msg: "400 Bad Request" });
    });
  });
  describe("GET /api/articles/:article_id", () => {
    it("200: responds with the specified article object", async () => {
      const {
        body: { article },
      } = await request(app).get("/api/articles/1").expect(200);
      expect(article).toEqual({
        article_id: 1,
        title: "Living in the shadow of a great man",
        topic: "mitch",
        author: "butter_bridge",
        body: "I find this existence challenging",
        created_at: "2020-07-09T20:11:00.000Z",
        votes: 100,
        article_img_url:
          "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
        comment_count: 11,
      });
    });
    it("400: responds with an error message when the article_id is invalid", async () => {
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
    it("200: responds with an array of comment objects from the specified article in descending order (most recent first)", async () => {
      const {
        body: { comments },
      } = await request(app).get("/api/articles/1/comments").expect(200);
      expect(comments.length).toBeGreaterThan(0);
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
      expect(comments).toBeSortedBy("created_at", { descending: true });
    });
  });
  describe("POST /api/articles", () => {
    it("200: responds with the posted article object", async () => {
      const inputArticle = {
        title: "article_title",
        topic: "cats",
        author: "butter_bridge",
        body: "article_body",
        article_img_url: "img_url",
      };
      const {
        body: { article },
      } = await request(app)
        .post("/api/articles")
        .send(inputArticle)
        .expect(200);
      expect(article).toEqual({
        article_id: expect.any(Number),
        title: "article_title",
        topic: "cats",
        author: "butter_bridge",
        body: "article_body",
        created_at: expect.any(String),
        votes: 0,
        article_img_url: "img_url",
        comment_count: 0,
      });
    });
    it("200: article_img_url defaults to null when omitted", async () => {
      const inputArticle = {
        title: "article_title",
        topic: "cats",
        author: "butter_bridge",
        body: "article_body",
      };
      const {
        body: { article },
      } = await request(app)
        .post("/api/articles")
        .send(inputArticle)
        .expect(200);
      expect(article).toEqual({
        article_id: expect.any(Number),
        title: "article_title",
        topic: "cats",
        author: "butter_bridge",
        body: "article_body",
        created_at: expect.any(String),
        votes: 0,
        article_img_url: null,
        comment_count: 0,
      });
    });
    it("400: responds with an error message when an inputArticle key is invalid", async () => {
      const inputArticle = {
        invalid_field: "article_title",
        topic: "cats",
        author: "butter_bridge",
        body: "article_body",
        article_img_url: "img_url",
      };
      const { body: err } = await request(app)
        .post("/api/articles")
        .send(inputArticle)
        .expect(400);
      expect(err).toEqual({
        msg: "400 Bad Request",
      });
    });
    it("400: responds with an error message when an optional inputArticle key is invalid", async () => {
      const inputArticle = {
        title: "article_title",
        topic: "cats",
        author: "butter_bridge",
        body: "article_body",
        invalid_field: "img_url",
      };
      const { body: err } = await request(app)
        .post("/api/articles")
        .send(inputArticle)
        .expect(400);
      expect(err).toEqual({
        msg: "400 Bad Request",
      });
    });
    it("400: responds with an error message when an inputArticle value is invalid", async () => {
      const inputArticle = {
        title: "article_title",
        topic: "invalid_topic",
        author: "butter_bridge",
        body: "article_body",
        article_img_url: "img_url",
      };
      const { body: err } = await request(app)
        .post("/api/articles")
        .send(inputArticle)
        .expect(400);
      expect(err).toEqual({
        msg: "400 Bad Request",
      });
    });
  });
  describe("POST /api/articles/:article_id/comments", () => {
    it("200: responds with the posted comment object", async () => {
      const inputComment = {
        username: "butter_bridge",
        body: "comment",
      };
      const {
        body: { comment },
      } = await request(app)
        .post("/api/articles/1/comments")
        .send(inputComment)
        .expect(200);
      expect(comment).toEqual({
        comment_id: expect.any(Number),
        article_id: 1,
        body: "comment",
        votes: 0,
        author: "butter_bridge",
        created_at: expect.any(String),
      });
    });
    it("400: responds with an error message when an inputComment key is invalid", async () => {
      const inputComment = {
        invalid_field: "butter_bridge",
        body: "comment",
      };
      const { body: err } = await request(app)
        .post("/api/articles/1/comments")
        .send(inputComment)
        .expect(400);
      expect(err).toEqual({
        msg: "400 Bad Request: one or more fields are invalid.",
      });
    });
    it("400: responds with an error message when an inputComment value is invalid", async () => {
      const inputComment = {
        username: "invalid_username",
        body: "comment",
      };
      const { body: err } = await request(app)
        .post("/api/articles/1/comments")
        .send(inputComment)
        .expect(400);
      expect(err).toEqual({
        msg: "400 Bad Request",
      });
    });
  });
  describe("PATCH /api/articles/:article_id", () => {
    it("200: responds with the updated article object when passed a positive newVote", async () => {
      const newVote = 1;
      const inputVotes = {
        inc_votes: newVote,
      };
      const {
        body: { article },
      } = await request(app)
        .patch("/api/articles/1")
        .send(inputVotes)
        .expect(200);
      expect(article).toEqual({
        article_id: 1,
        title: "Living in the shadow of a great man",
        topic: "mitch",
        author: "butter_bridge",
        body: "I find this existence challenging",
        created_at: "2020-07-09T20:11:00.000Z",
        votes: 101,
        article_img_url:
          "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
      });
    });
    it("200: responds with the updated article object when passed a negative newVote", async () => {
      const newVote = -1;
      const inputVotes = {
        inc_votes: newVote,
      };
      const {
        body: { article },
      } = await request(app)
        .patch("/api/articles/1")
        .send(inputVotes)
        .expect(200);
      expect(article).toEqual({
        article_id: 1,
        title: "Living in the shadow of a great man",
        topic: "mitch",
        author: "butter_bridge",
        body: "I find this existence challenging",
        created_at: "2020-07-09T20:11:00.000Z",
        votes: 99,
        article_img_url:
          "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
      });
    });
    it("400: responds with an error message when the newVote count is invalid", async () => {
      const newVote = 1.1;
      const inputVotes = {
        inc_votes: newVote,
      };
      const { body: err } = await request(app)
        .patch("/api/articles/1")
        .send(inputVotes)
        .expect(400);
      expect(err).toEqual({ msg: "400 Bad Request" });
    });
  });
});
describe("comment endpoints", () => {
  describe("DELETE /api/comments/:comment_id", () => {
    it("204: response object includes a noContent key of value true", async () => {
      const { noContent } = await request(app)
        .delete("/api/comments/1")
        .expect(204);
      expect(noContent).toBe(true);
    });
    it("400: responds with an error message when the comment_id is invalid", async () => {
      const { body: err } = await request(app)
        .delete("/api/comments/invalid_id")
        .expect(400);
      expect(err).toEqual({ msg: "400 Bad Request" });
    });
    it("404: responds with an error message when the specified comment doesn't exist", async () => {
      const { body: err } = await request(app)
        .delete("/api/comments/9999")
        .expect(404);
      expect(err).toEqual({ msg: "404 Not Found" });
    });
  });
  describe("PATCH /api/comments/:comment_id", () => {
    it("200: responds with the updated comment object when passed a positive newVote", async () => {
      const newVote = 1;
      const inputVotes = {
        inc_votes: newVote,
      };
      const {
        body: { comment },
      } = await request(app)
        .patch("/api/comments/1")
        .send(inputVotes)
        .expect(200);
      expect(comment).toEqual({
        comment_id: 1,
        article_id: 9,
        body: "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
        votes: 17,
        author: "butter_bridge",
        created_at: "2020-04-06T12:17:00.000Z",
      });
    });
    it("200: responds with the updated comment object when passed a negative newVote", async () => {
      const newVote = -1;
      const inputVotes = {
        inc_votes: newVote,
      };
      const {
        body: { comment },
      } = await request(app)
        .patch("/api/comments/1")
        .send(inputVotes)
        .expect(200);
      expect(comment).toEqual({
        comment_id: 1,
        article_id: 9,
        body: "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
        votes: 15,
        author: "butter_bridge",
        created_at: "2020-04-06T12:17:00.000Z",
      });
    });
    it("400: responds with an error message when the newVote count is invalid", async () => {
      const newVote = 1.1;
      const inputVotes = {
        inc_votes: newVote,
      };
      const { body: err } = await request(app)
        .patch("/api/comments/1")
        .send(inputVotes)
        .expect(400);
      expect(err).toEqual({ msg: "400 Bad Request" });
    });
  });
});
