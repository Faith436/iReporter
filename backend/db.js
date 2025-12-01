// db.js
const mysql = require("mysql2/promise");
require("dotenv").config();

const pool = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
<<<<<<< HEAD
  password: process.env.DB_PASSWORD || "feyth&100%",
=======
  port: process.env.DB_PORT,  
  password: process.env.DB_PASSWORD || "",
>>>>>>> 9852c23f03473f0e720e3dabc2dd6d0b1dd51593
  database: process.env.DB_NAME || "ireporter",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

<<<<<<< HEAD
module.exports = pool;
=======

module.exports = pool;
>>>>>>> 9852c23f03473f0e720e3dabc2dd6d0b1dd51593
