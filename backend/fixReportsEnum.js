const pool = require("./db");

async function fixEnum() {
  try {
    await pool.query(`
      ALTER TABLE reports 
      MODIFY status ENUM('pending', 'under-investigation', 'resolved', 'rejected') DEFAULT 'pending';
    `);

    console.log("ENUM fixed!");
    process.exit(0);
  } catch (err) {
    console.error("Error fixing ENUM:", err);
    process.exit(1);
  }
}

fixEnum();
