require('dotenv').config()

const env = process.env;

const config = {
  db: { 
    host: env.DB_HOST ,
    user: env.DB_USER ,
    password: env.DB_PASSWORD ,
    database: env.DB_NAME ,
  },
  listPerPage: env.LIST_PER_PAGE || 10,
};
module.exports = config;
