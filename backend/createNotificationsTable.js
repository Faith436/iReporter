// backend/createNotificationsTable.js
const db = require('../config/db');

const createNotificationsTable = async () => {
  try {
    console.log('🔄 Creating notifications table...');

    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS notifications (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        message TEXT NOT NULL,
        is_read BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `;

    await db.query(createTableQuery);
    console.log('✅ Notifications table created successfully!');
    
    process.exit(0);
  } catch (err) {
    console.error('❌ Failed to create notifications table:', err);
    process.exit(1);
  }
};

createNotificationsTable();