// seedAdmin.js
const pool = require("./db");
const bcrypt = require("bcrypt");

async function seedAdmin() {
  try {
    const hashedPassword = await bcrypt.hash("feyth&100%", 10); // new password
    await pool.query(`
      INSERT INTO users (first_name, last_name, email, password, role)
      VALUES ('Nanvule', 'Faith', 'nanvule.faith.upti@gmail.com', ?, 'admin')
    `, [hashedPassword]);
    console.log("Admin user created!");
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

seedAdmin();
