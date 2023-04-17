const mysql = require('mysql2');
require('dotenv').config();

const db = mysql.createConnection(
  {
    host: 'localhost',
    user: 'root',
    password: process.env.SECRET_KEY,
    database: 'business_db'
  },
  console.log(`Connected to the business_db database.`)
);



module.exports = db;