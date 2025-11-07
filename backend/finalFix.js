// backend/finalFix.js - FIXED VERSION
const db = require('./config/db');

const finalFix = async () => {
  try {
    console.log('🔄 Applying final database fixes...');

    // 1. Create notifications table
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

    await db.query(createNotificationsTable);
    console.log('✅ Notifications table created');

    // 2. Check if media column exists before adding it
    try {
      const addMediaColumn = `
        ALTER TABLE reports 
        ADD COLUMN media TEXT AFTER date_reported
      `;
      await db.query(addMediaColumn);
      console.log('✅ Media column added to reports table');
    } catch (err) {
      if (err.code === 'ER_DUP_FIELDNAME') {
        console.log('✅ Media column already exists in reports table');
      } else {
        throw err;
      }
    }

    console.log('🎉 All database fixes completed!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Database fixes failed:', err);
    process.exit(1);
  }
};

finalFix();