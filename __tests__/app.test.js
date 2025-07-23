const db = require("../db/connection.js");
const seed = require("../db/seeds/seed.js");
const data = require("../db/data/test-data");
const app = require("../app.js");
const endpointsJson = require("../endpoints.json");
const request = require("supertest");

beforeEach(() => seed(data));
afterAll(() => db.end());

describe("GET /api", () => {
  it("200: Responds with an object detailing the documentation for each endpoint", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then(({ body: { endpoints } }) => {
        expect(endpoints).toEqual(endpointsJson);
      });
  });
});
