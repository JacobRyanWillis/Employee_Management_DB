const mysql = require('mysql2');
const express = require('exress');

const PORT = process.env.PORT || 3001;
const app = express();

// Express middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Connect to database
const db = mysql.createConnection(
  {
    host: 'localhost',
    // MySQL username,
    user: 'root',
    // TODO: Add MySQL password here and database name
    password: '',
    database: ''
  },
//  TODO: Add the name of database here
  console.log(`Connected to the database.`)
);