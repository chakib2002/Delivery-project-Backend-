require('dotenv').config()

const env = process.env;

const config = {
  db: { 
    host: env.DB_HOST || 'ba8mjqrdgehrofcjujib-mysql.services.clever-cloud.com',
    user: env.DB_USER || 'ufbayx6yxahkd9gf',
    password: env.DB_PASSWORD || 'M9xCJPkcExbmwN5UrdCF',
    database: env.DB_NAME || 'ba8mjqrdgehrofcjujib',
  },
  listPerPage: env.LIST_PER_PAGE || 10,
};
module.exports = config;