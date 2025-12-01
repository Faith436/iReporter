// seedAdmin.js
const pool = require("./db");
const bcrypt = require("bcrypt");

async function seedAdmin() {
  try {
    const hashedPassword = await bcrypt.hash("wisdom1jeremiah123", 10);
    await pool.query(`
      INSERT INTO users (first_name, last_name, email, password, role)
      VALUES ('Wisdom', 'Jeremiah', 'wisdomjeremiah57@gmail.com', ?, 'admin')
    `, [hashedPassword]);
    console.log("Admin user created!");
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

seedAdmin();
