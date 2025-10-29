const db = require('../config/database');

// In models/init.js, update the admin user insertion:
const insertAdmin = `
  INSERT IGNORE INTO users (first_name, last_name, email, password, role) 
  VALUES ('Admin', 'User', 'admin@ireporter.com', 'admin123', 'admin')
`;

// And the test user:
const insertTestUser = `
  INSERT IGNORE INTO users (first_name, last_name, email, password, role) 
  VALUES ('Test', 'User', 'user@ireporter.com', 'user123', 'user')
`;

const initDatabase = () => {
  // Create Users table
  const createUsersTable = `
    CREATE TABLE IF NOT EXISTS users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      first_name VARCHAR(100) NOT NULL,
      last_name VARCHAR(100) NOT NULL,
      email VARCHAR(255) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL,
      role ENUM('user', 'admin') DEFAULT 'user',
      phone VARCHAR(20),
      is_active BOOLEAN DEFAULT TRUE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )
  `;

  // Create Reports table
  const createReportsTable = `
    CREATE TABLE IF NOT EXISTS reports (
      id INT AUTO_INCREMENT PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      description TEXT NOT NULL,
      report_type ENUM('Red-Flag', 'Intervention') NOT NULL,
      status ENUM('pending', 'under investigation', 'resolved', 'rejected') DEFAULT 'pending',
      location VARCHAR(500) NOT NULL,
      latitude DECIMAL(10, 8),
      longitude DECIMAL(11, 8),
      user_id INT NOT NULL,
      date_reported DATE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )
  `;

  // Create Status History table
  const createStatusHistoryTable = `
    CREATE TABLE IF NOT EXISTS status_history (
      id INT AUTO_INCREMENT PRIMARY KEY,
      report_id INT NOT NULL,
      status ENUM('pending', 'under investigation', 'resolved', 'rejected') NOT NULL,
      note TEXT NOT NULL,
      changed_by INT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (report_id) REFERENCES reports(id) ON DELETE CASCADE,
      FOREIGN KEY (changed_by) REFERENCES users(id) ON DELETE CASCADE
    )
  `;

  // Create Evidence table
  const createEvidenceTable = `
    CREATE TABLE IF NOT EXISTS evidence (
      id INT AUTO_INCREMENT PRIMARY KEY,
      report_id INT NOT NULL,
      filename VARCHAR(255) NOT NULL,
      file_path VARCHAR(500) NOT NULL,
      file_type ENUM('image', 'video') NOT NULL,
      uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (report_id) REFERENCES reports(id) ON DELETE CASCADE
    )
  `;

  const queries = [
    createUsersTable,
    createReportsTable,
    createStatusHistoryTable,
    createEvidenceTable
  ];

  queries.forEach((query, index) => {
    db.query(query, (err, results) => {
      if (err) {
        console.error(`Error creating table ${index + 1}:`, err);
      } else {
        console.log(`Table ${index + 1} created/verified successfully`);
      }
    });
  });

  // Insert default admin user with correct column names
  const insertAdmin = `
    INSERT IGNORE INTO users (first_name, last_name, email, password, role) 
    VALUES ('Admin', 'User', 'admin@ireporter.com', 'admin123', 'admin')
  `;

  db.query(insertAdmin, (err, results) => {
    if (err) {
      console.error('Error inserting admin user:', err);
    } else if (results.affectedRows > 0) {
      console.log('Default admin user created (temporary password: admin123)');
    } else {
      console.log('Admin user already exists');
    }
  });

  // Insert default test user
  const insertTestUser = `
    INSERT IGNORE INTO users (first_name, last_name, email, password, role) 
    VALUES ('Test', 'User', 'user@ireporter.com', 'user123', 'user')
  `;

  db.query(insertTestUser, (err, results) => {
    if (err) {
      console.error('Error inserting test user:', err);
    } else if (results.affectedRows > 0) {
      console.log('Default test user created (temporary password: user123)');
    } else {
      console.log('Test user already exists');
    }
  });
};

module.exports = initDatabase;