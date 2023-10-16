import knex from 'knex';

export default knex({
    client: 'mysql2',
    connection: {
      host : 'db4free.net',
      port : 3306,
      user : 'hcmus_py',
      password : '97cf7a8d',
      database : 'hcmus_foodrecipe'
    },
    pool: { min: 0, max: 10 }
  });