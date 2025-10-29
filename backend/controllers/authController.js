const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/database');

// // Register new user
// const register = async (req, res) => {
//   try {
//     const { firstName, lastName, email, password, confirmPassword, phone } = req.body;

//     // Validation
//     if (password !== confirmPassword) {
//       return res.status(400).json({ message: 'Passwords do not match' });
//     }

//     if (password.length < 6) {
//       return res.status(400).json({ message: 'Password must be at least 6 characters' });
//     }

//     // Check if user exists
//     const [existingUsers] = await db.promise().query(
//       'SELECT id FROM users WHERE email = ?',
//       [email]
//     );

//     if (existingUsers.length > 0) {
//       return res.status(400).json({ message: 'User already exists with this email' });
//     }

//     // Hash password
//     const hashedPassword = await bcrypt.hash(password, 12);
//     const name = `${firstName} ${lastName}`;

//     // Insert user
//     const [result] = await db.promise().query(
//       'INSERT INTO users (name, email, password, phone) VALUES (?, ?, ?, ?)',
//       [name, email, hashedPassword, phone]
//     );

//     // Generate token
//     const token = jwt.sign(
//       { userId: result.insertId },
//       process.env.JWT_SECRET || 'your-secret-key',
//       { expiresIn: '7d' }
//     );

//     // Get created user
//     const [users] = await db.promise().query(
//       'SELECT id, name, email, role FROM users WHERE id = ?',
//       [result.insertId]
//     );

//     res.status(201).json({
//       message: 'User registered successfully',
//       token,
//       user: users[0]
//     });

//   } catch (error) {
//     console.error('Registration error:', error);
//     res.status(500).json({ message: 'Server error during registration' });
//   }
// };

// // Login user
// const login = async (req, res) => {
//   try {
//     const { email, password } = req.body;

//     // Find user
//     const [users] = await db.promise().query(
//       'SELECT * FROM users WHERE email = ? AND is_active = TRUE',
//       [email]
//     );

//     if (users.length === 0) {
//       return res.status(400).json({ message: 'Invalid credentials' });
//     }

//     const user = users[0];

//     // Check password
//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch) {
//       return res.status(400).json({ message: 'Invalid credentials' });
//     }

//     // Generate token
//     const token = jwt.sign(
//       { userId: user.id },
//       process.env.JWT_SECRET || 'your-secret-key',
//       { expiresIn: '7d' }
//     );

//     res.json({
//       message: 'Login successful',
//       token,
//       user: {
//         id: user.id,
//         name: user.name,
//         email: user.email,
//         role: user.role
//       }
//     });

//   } catch (error) {
//     console.error('Login error:', error);
//     res.status(500).json({ message: 'Server error during login' });
//   }
// };

// // Get current user
// const getMe = async (req, res) => {
//   try {
//     res.json({
//       user: req.user
//     });
//   } catch (error) {
//     console.error('Get user error:', error);
//     res.status(500).json({ message: 'Server error' });
//   }
// };

// module.exports = { register, login, getMe };

const register = async (req, res) => {
  try {
    const { firstName, lastName, email, password, confirmPassword, phone } = req.body;

    console.log('📝 Registration attempt:', { firstName, lastName, email, phone });

    // Validation
    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ message: 'Passwords do not match' });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters' });
    }

    // Check if user exists
    const [existingUsers] = await db.promise().query(
      'SELECT id FROM users WHERE email = ?',
      [email]
    );

    if (existingUsers.length > 0) {
      return res.status(400).json({ message: 'User already exists with this email' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Insert user with first_name and last_name
    const [result] = await db.promise().query(
      'INSERT INTO users (first_name, last_name, email, password, phone) VALUES (?, ?, ?, ?, ?)',
      [firstName, lastName, email, hashedPassword, phone || null]
    );

    console.log('✅ User inserted with ID:', result.insertId);

    // Generate token
    const token = jwt.sign(
      { userId: result.insertId },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    );

    // Get created user
    const [users] = await db.promise().query(
      'SELECT id, first_name, last_name, email, role FROM users WHERE id = ?',
      [result.insertId]
    );

    const user = users[0];
    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        id: user.id,
        name: `${user.first_name} ${user.last_name}`,
        email: user.email,
        role: user.role
      }
    });

  } catch (error) {
    console.error('❌ Registration error:', error);
    console.error('❌ Error details:', {
      message: error.message,
      code: error.code,
      sqlMessage: error.sqlMessage
    });
    res.status(500).json({ message: 'Server error during registration: ' + error.message });
  }
};