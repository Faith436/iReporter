// backend/updateDatabase.js
const db = require('../config/db');

const updateDatabase = async () => {
  try {
    console.log('🔄 Updating database schema...');

    // Add missing columns to reports table
    const alterReportsTable = `
      ALTER TABLE reports 
      ADD COLUMN IF NOT EXISTS specific_title VARCHAR(255) AFTER title,
      ADD COLUMN IF NOT EXISTS media TEXT AFTER date_reported
    `;

    // Create notifications table if it doesn't exist
    const createNotificationsTable = `
      CREATE TABLE IF NOT EXISTS notifications (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        message TEXT NOT NULL,
        is_read BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `;

    await db.query(alterReportsTable);
    console.log('✅ Added missing columns to reports table');

    await db.query(createNotificationsTable);
    console.log('✅ Created notifications table');

    console.log('🎉 Database update completed successfully!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Database update failed:', err);
    process.exit(1);
  }
};

updateDatabase();