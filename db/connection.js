const { Pool } = require("pg");

const ENV = process.env.NODE_ENV || "development";

require("dotenv").config({ path: `${__dirname}/../.env.${ENV}` });

//const db = new Pool();

if (!process.env.PGDATABASE && !process.env.DATABASE_URL)
  throw new Error("No PGDATABASE or DATABASE_URL configured");

const config = {};

if (ENV === "production") {
  config.connectionString = process.env.DATABASE_URL;
  config.max = 2;
}

module.exports = new Pool(config);
