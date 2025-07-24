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

describe("GET /api/topics", () => {
  it("200: responds with an array of topic objects", async () => {
    const {
      body: { topics },
    } = await request(app).get("/api/topics").expect(200);
    expect(topics).toEqual(data.topicData);
  });
});

describe("GET /api/articles", () => {
  it("200: responds with an array of articles", async () => {
    const {
      body: { articles },
    } = await request(app).get("/api/articles").expect(200);
    articles.forEach((article) => {
      expect(article).toEqual(
        expect.objectContaining({
          author: expect.any(String),
          title: expect.any(String),
          article_id: expect.any(Number),
          topic: expect.any(String),
          created_at: expect.any(String),
          votes: expect.any(Number),
          article_img_url: expect.any(String),
          comment_count: expect.any(Number),
        })
      );
    });
  });
});
