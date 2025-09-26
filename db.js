// db.js
const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',         // ganti sesuai user PostgreSQL kamu
  host: 'localhost',
  database: 'ivantest', // ganti dengan nama database kamu
  password: '21gunsIvan',     // ganti dengan password PostgreSQL kamu
  port: 5432,               // default port PostgreSQL
});

module.exports = pool;
