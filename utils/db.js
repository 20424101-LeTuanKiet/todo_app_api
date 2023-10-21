import knex from 'knex';
import 'dotenv/config';

export default knex({
    client: process.env.DB_CLIENT,
    connection: {
      host : process.env.DB_CONNECTION_HOST,
      port : process.env.DB_CONNECTION_PORT,
      user : process.env.DB_CONNECTION_USER,
      password : process.env.DB_CONNECTION_PASSWORD,
      database : process.env.DB_CONNECTION_DATABASE
    },
    pool: { min: 0, max: 10 }
  });