// const mysql = require('mysql2/promise');
// const dotenv = require("dotenv");
// dotenv.config();

// const db = mysql.createPool({
//   host: process.env.DB_HOST,
//   user: process.env.DB_USER,
//   password: process.env.DB_PASSWORD,
//   database: process.env.DB_NAME,
// });

// // Test the connection
// (async () => {
//   try {
//     const connection = await db.getConnection();
//     console.log("✅ Connected to MySQL!");
//     connection.release();
//   } catch (err) {
//     console.error("❌ Database connection failed:", err.message);
//   }
// })();

// module.exports = db;

// db.js
const mysql = require("mysql2/promise");
require("dotenv").config();

const pool = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "ireporter",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

module.exports = pool;
