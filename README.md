# NC News Seeding

## Setup

In order to connect to each database locally:

- Create a .env.development file containing the following code: PGDATABASE=nc_news
- Create a .env.test file containing the following code: PGDATABASE=nc_news_test
- If on linux, you will need to also include your psql password in a similar fashion: PGPASSWORD=my_password
