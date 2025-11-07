<<<<<<< Updated upstream
// const db = require('../config/database');

// // Get all reports with filters
// const getReports = async (req, res) => {
//   try {
//     const { reportType, status, page = 1, limit = 10 } = req.query;
//     const offset = (page - 1) * limit;

//     let query = `
//       SELECT r.*, u.name as user_name 
//       FROM reports r 
//       LEFT JOIN users u ON r.user_id = u.id 
//       WHERE 1=1
//     `;
//     const params = [];

//     if (reportType && reportType !== 'all') {
//       query += ' AND r.report_type = ?';
//       params.push(reportType);
//     }

//     if (status && status !== 'all') {
//       query += ' AND r.status = ?';
//       params.push(status);
//     }

//     // If user is not admin, only show their reports
//     if (req.user.role === 'user') {
//       query += ' AND r.user_id = ?';
//       params.push(req.user.id);
//     }

//     query += ' ORDER BY r.created_at DESC LIMIT ? OFFSET ?';
//     params.push(parseInt(limit), offset);

//     const [reports] = await db.promise().query(query, params);

//     // Get total count for pagination
//     let countQuery = 'SELECT COUNT(*) as total FROM reports WHERE 1=1';
//     const countParams = [];

//     if (reportType && reportType !== 'all') {
//       countQuery += ' AND report_type = ?';
//       countParams.push(reportType);
//     }

//     if (status && status !== 'all') {
//       countQuery += ' AND status = ?';
//       countParams.push(status);
//     }

//     if (req.user.role === 'user') {
//       countQuery += ' AND user_id = ?';
//       countParams.push(req.user.id);
//     }

//     const [countResult] = await db.promise().query(countQuery, countParams);
//     const total = countResult[0].total;

//     // Get evidence for each report
//     for (let report of reports) {
//       const [evidence] = await db.promise().query(
//         'SELECT * FROM evidence WHERE report_id = ?',
//         [report.id]
//       );
//       report.evidence = evidence;

//       const [history] = await db.promise().query(
//         `SELECT sh.*, u.name as changed_by_name 
//          FROM status_history sh 
//          LEFT JOIN users u ON sh.changed_by = u.id 
//          WHERE sh.report_id = ? 
//          ORDER BY sh.created_at DESC`,
//         [report.id]
//       );
//       report.history = history;
//     }

//     res.json({
//       reports,
//       pagination: {
//         current: parseInt(page),
//         total: Math.ceil(total / limit),
//         totalRecords: total
//       }
//     });

//   } catch (error) {
//     console.error('Get reports error:', error);
//     res.status(500).json({ message: 'Server error fetching reports' });
//   }
// };

// // Get single report
// const getReport = async (req, res) => {
//   try {
//     const { id } = req.params;

//     const [reports] = await db.promise().query(
//       `SELECT r.*, u.name as user_name 
//        FROM reports r 
//        LEFT JOIN users u ON r.user_id = u.id 
//        WHERE r.id = ?`,
//       [id]
//     );

//     if (reports.length === 0) {
//       return res.status(404).json({ message: 'Report not found' });
//     }

//     const report = reports[0];

//     // Check if user owns the report or is admin
//     if (req.user.role === 'user' && report.user_id !== req.user.id) {
//       return res.status(403).json({ message: 'Access denied' });
//     }

//     // Get evidence
//     const [evidence] = await db.promise().query(
//       'SELECT * FROM evidence WHERE report_id = ?',
//       [id]
//     );
//     report.evidence = evidence;

//     // Get status history
//     const [history] = await db.promise().query(
//       `SELECT sh.*, u.name as changed_by_name 
//        FROM status_history sh 
//        LEFT JOIN users u ON sh.changed_by = u.id 
//        WHERE sh.report_id = ? 
//        ORDER BY sh.created_at ASC`,
//       [id]
//     );
//     report.history = history;

//     res.json({ report });

//   } catch (error) {
//     console.error('Get report error:', error);
//     res.status(500).json({ message: 'Server error fetching report' });
//   }
// };

// // Create new report
// const createReport = async (req, res) => {
//   try {
//     const { title, description, reportType, location, coordinates, date } = req.body;

//     // Parse coordinates
//     let latitude = null, longitude = null;
//     if (coordinates) {
//       const [lat, lng] = coordinates.split(',').map(coord => parseFloat(coord.trim()));
//       if (!isNaN(lat) && !isNaN(lng)) {
//         latitude = lat;
//         longitude = lng;
//       }
//     }

//     const [result] = await db.promise().query(
//       `INSERT INTO reports 
//        (title, description, report_type, location, latitude, longitude, user_id, date_reported) 
//        VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
//       [title, description, reportType, location, latitude, longitude, req.user.id, date || new Date()]
//     );

//     // Add initial status history
//     await db.promise().query(
//       'INSERT INTO status_history (report_id, status, note, changed_by) VALUES (?, ?, ?, ?)',
//       [result.insertId, 'pending', 'Report submitted', req.user.id]
//     );

//     // Handle file uploads
//     if (req.files && req.files.length > 0) {
//       for (const file of req.files) {
//         const fileType = file.mimetype.startsWith('image/') ? 'image' : 'video';
//         await db.promise().query(
//           'INSERT INTO evidence (report_id, filename, file_path, file_type) VALUES (?, ?, ?, ?)',
//           [result.insertId, file.filename, file.path, fileType]
//         );
//       }
//     }

//     // Get created report with details
//     const [reports] = await db.promise().query(
//       'SELECT * FROM reports WHERE id = ?',
//       [result.insertId]
//     );

//     res.status(201).json({
//       message: 'Report created successfully',
//       report: reports[0]
//     });

//   } catch (error) {
//     console.error('Create report error:', error);
//     res.status(500).json({ message: 'Server error creating report' });
//   }
// };

// // Update report status (Admin only)
// const updateReportStatus = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { status, note, notifyEmail, notifySMS } = req.body;

//     // Check if report exists
//     const [reports] = await db.promise().query(
//       'SELECT * FROM reports WHERE id = ?',
//       [id]
//     );

//     if (reports.length === 0) {
//       return res.status(404).json({ message: 'Report not found' });
//     }

//     // Update report status
//     await db.promise().query(
//       'UPDATE reports SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
//       [status, id]
//     );

//     // Add status history
//     await db.promise().query(
//       'INSERT INTO status_history (report_id, status, note, changed_by) VALUES (?, ?, ?, ?)',
//       [id, status, note || `Status changed to ${status}`, req.user.id]
//     );

//     // TODO: Implement email/SMS notifications here

//     res.json({ message: 'Report status updated successfully' });

//   } catch (error) {
//     console.error('Update status error:', error);
//     res.status(500).json({ message: 'Server error updating status' });
//   }
// };

// // Update report (User only for pending reports)
// const updateReport = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { title, description, location, coordinates } = req.body;
=======
const db = require("../config/db");
const path = require("path");
>>>>>>> Stashed changes

//     // Check if report exists and belongs to user
//     const [reports] = await db.promise().query(
//       'SELECT * FROM reports WHERE id = ? AND user_id = ? AND status = "pending"',
//       [id, req.user.id]
//     );

//     if (reports.length === 0) {
//       return res.status(404).json({ message: 'Report not found or cannot be edited' });
//     }

//     // Parse coordinates
//     let latitude = null, longitude = null;
//     if (coordinates) {
//       const [lat, lng] = coordinates.split(',').map(coord => parseFloat(coord.trim()));
//       if (!isNaN(lat) && !isNaN(lng)) {
//         latitude = lat;
//         longitude = lng;
//       }
//     }

//     await db.promise().query(
//       `UPDATE reports 
//        SET title = ?, description = ?, location = ?, latitude = ?, longitude = ?, updated_at = CURRENT_TIMESTAMP 
//        WHERE id = ?`,
//       [title, description, location, latitude, longitude, id]
//     );

//     res.json({ message: 'Report updated successfully' });

//   } catch (error) {
//     console.error('Update report error:', error);
//     res.status(500).json({ message: 'Server error updating report' });
//   }
// };

// // Delete report
// const deleteReport = async (req, res) => {
//   try {
//     const { id } = req.params;

//     let query = 'DELETE FROM reports WHERE id = ?';
//     const params = [id];

//     // If user is not admin, only allow deleting their own reports
//     if (req.user.role === 'user') {
//       query += ' AND user_id = ?';
//       params.push(req.user.id);
//     }

//     const [result] = await db.promise().query(query, params);

//     if (result.affectedRows === 0) {
//       return res.status(404).json({ message: 'Report not found or access denied' });
//     }

//     res.json({ message: 'Report deleted successfully' });

//   } catch (error) {
//     console.error('Delete report error:', error);
//     res.status(500).json({ message: 'Server error deleting report' });
//   }
// };

// module.exports = {
//   getReports,
//   getReport,
//   createReport,
//   updateReportStatus,
//   updateReport,
//   deleteReport
// };

const db = require('../config/database');

// Get all reports with filters
const getReports = async (req, res) => {
  try {
    const { reportType, status, page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    let query = `
      SELECT r.*, u.name as user_name 
      FROM reports r 
      LEFT JOIN users u ON r.user_id = u.id 
      WHERE 1=1
    `;
    const params = [];

    if (reportType && reportType !== 'all') {
      query += ' AND r.report_type = ?';
      params.push(reportType);
    }

    if (status && status !== 'all') {
      query += ' AND r.status = ?';
      params.push(status);
    }

    // If user is not admin, only show their reports
    if (req.user.role === 'user') {
      query += ' AND r.user_id = ?';
      params.push(req.user.id);
    }

    query += ' ORDER BY r.created_at DESC LIMIT ? OFFSET ?';
    params.push(parseInt(limit), offset);

    const [reports] = await db.promise().query(query, params);

    // Get total count for pagination
    let countQuery = 'SELECT COUNT(*) as total FROM reports WHERE 1=1';
    const countParams = [];

    if (reportType && reportType !== 'all') {
      countQuery += ' AND report_type = ?';
      countParams.push(reportType);
    }

    if (status && status !== 'all') {
      countQuery += ' AND status = ?';
      countParams.push(status);
    }

    if (req.user.role === 'user') {
      countQuery += ' AND user_id = ?';
      countParams.push(req.user.id);
    }

    const [countResult] = await db.promise().query(countQuery, countParams);
    const total = countResult[0].total;

    // Get evidence for each report
    for (let report of reports) {
      const [evidence] = await db.promise().query(
        'SELECT * FROM evidence WHERE report_id = ?',
        [report.id]
      );
      report.evidence = evidence;

      const [history] = await db.promise().query(
        `SELECT sh.*, u.name as changed_by_name 
         FROM status_history sh 
         LEFT JOIN users u ON sh.changed_by = u.id 
         WHERE sh.report_id = ? 
         ORDER BY sh.created_at DESC`,
        [report.id]
      );
      report.history = history;
    }

    res.json({
      reports,
      pagination: {
        current: parseInt(page),
        total: Math.ceil(total / limit),
        totalRecords: total
      }
    });

  } catch (error) {
    console.error('Get reports error:', error);
    res.status(500).json({ message: 'Server error fetching reports' });
  }
};

// Get single report
const getReport = async (req, res) => {
  try {
    const { id } = req.params;

    const [reports] = await db.promise().query(
      `SELECT r.*, u.name as user_name 
       FROM reports r 
       LEFT JOIN users u ON r.user_id = u.id 
       WHERE r.id = ?`,
      [id]
    );

    if (reports.length === 0) {
      return res.status(404).json({ message: 'Report not found' });
    }

    const report = reports[0];

    // Check if user owns the report or is admin
    if (req.user.role === 'user' && report.user_id !== req.user.id) {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Get evidence
    const [evidence] = await db.promise().query(
      'SELECT * FROM evidence WHERE report_id = ?',
      [id]
    );
    report.evidence = evidence;

    // Get status history
    const [history] = await db.promise().query(
      `SELECT sh.*, u.name as changed_by_name 
       FROM status_history sh 
       LEFT JOIN users u ON sh.changed_by = u.id 
       WHERE sh.report_id = ? 
       ORDER BY sh.created_at ASC`,
      [id]
    );
    report.history = history;

    res.json({ report });

  } catch (error) {
    console.error('Get report error:', error);
    res.status(500).json({ message: 'Server error fetching report' });
  }
};

<<<<<<< Updated upstream
// Create new report - FIXED VERSION
const createReport = async (req, res) => {
  try {
    console.log('=== CREATE REPORT START ===');
    console.log('Request body:', req.body);
    console.log('Request files:', req.files);
    console.log('User ID:', req.user.id);

    const { title, description, reportType, location, coordinates, date } = req.body;
=======
// --- GET ALL REPORTS (ADMIN) --- FIXED VERSION
exports.getAllReports = async (req, res) => {
  try {
    console.log("📊 Fetching ALL reports for admin");
      console.log("🔐 User making request:", req.user); // Add this
    console.log("🔐 User role:", req.user.role);
    const [rows] = await db.query(`
      
      SELECT r.*, u.first_name, u.last_name, u.email
      FROM reports r
      JOIN users u ON r.user_id = u.id
      ORDER BY r.created_at DESC
    `);
    
    // ✅ FIXED: Add user_name field to each report
    const reportsWithUser = rows.map(report => ({
      ...report,
      user_name: `${report.first_name} ${report.last_name}`
    }));
    
    console.log(`✅ Found ${reportsWithUser.length} reports for admin`);
    
    // ✅ FIXED: Always return success with data, even if empty
    res.json({
      success: true,
      data: reportsWithUser,
      count: reportsWithUser.length
    });
  } catch (err) {
    console.error("❌ Get all reports error:", err);
    res.status(500).json({ 
      success: false,
      message: "Server error fetching reports",
      error: err.message
    });
  }
};

// --- GET USER REPORTS ---
exports.getUserReports = async (req, res) => {
  try {
    console.log("📊 Fetching reports for user:", req.user.id);
    
    const [rows] = await db.query(
      `SELECT r.*, u.first_name, u.last_name, u.email
       FROM reports r 
       LEFT JOIN users u ON r.user_id = u.id 
       WHERE r.user_id = ? 
       ORDER BY r.created_at DESC`,
      [req.user.id]
    );
    
    // ✅ FIXED: Add user_name field to each report
    const userReports = rows.map(report => ({
      ...report,
      user_name: `${report.first_name} ${report.last_name}`
    }));
    
    console.log(`✅ Found ${userReports.length} reports for user ${req.user.id}`);
    
    // ✅ FIXED: Return consistent format
    res.json({
      success: true,
      data: userReports,
      count: userReports.length
    });
  } catch (err) {
    console.error("❌ Get user reports error:", err);
    res.status(500).json({ 
      success: false,
      message: "Server error fetching user reports",
      error: err.message
    });
  }
};
>>>>>>> Stashed changes

    // Validate required fields
    if (!title || !description || !reportType) {
      console.log('❌ Missing required fields');
      return res.status(400).json({ 
        message: 'Missing required fields: title, description, reportType' 
      });
    }

    console.log('📝 Received data:', { title, description, reportType, location, coordinates });

    // Parse coordinates
    let latitude = null, longitude = null;
    if (coordinates) {
      console.log('🗺️ Raw coordinates:', coordinates);
      try {
        const coordArray = coordinates.split(',').map(coord => coord.trim());
        if (coordArray.length === 2) {
          latitude = parseFloat(coordArray[0]);
          longitude = parseFloat(coordArray[1]);
          
          if (isNaN(latitude) || isNaN(longitude)) {
            console.log('❌ Invalid coordinate values');
            latitude = null;
            longitude = null;
          }
        }
      } catch (coordError) {
        console.log('❌ Coordinate parsing error:', coordError);
      }
    }

    console.log('📍 Parsed coordinates - lat:', latitude, 'lng:', longitude);

    // Insert report into database
    const [result] = await db.promise().query(
      `INSERT INTO reports 
       (title, description, report_type, location, latitude, longitude, user_id, date_reported) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [title, description, reportType, location, latitude, longitude, req.user.id, date || new Date()]
    );

    console.log('✅ Database insert successful - ID:', result.insertId);

    // Add initial status history
    await db.promise().query(
      'INSERT INTO status_history (report_id, status, note, changed_by) VALUES (?, ?, ?, ?)',
      [result.insertId, 'pending', 'Report submitted', req.user.id]
    );

    console.log('✅ Status history added');

    // Handle file uploads
    if (req.files && req.files.length > 0) {
      console.log('📎 Processing', req.files.length, 'file(s)');
      for (const file of req.files) {
        const fileType = file.mimetype.startsWith('image/') ? 'image' : 'video';
        await db.promise().query(
          'INSERT INTO evidence (report_id, filename, file_path, file_type) VALUES (?, ?, ?, ?)',
          [result.insertId, file.filename, file.path, fileType]
        );
        console.log('✅ File saved:', file.filename);
      }
    }

    // Get created report with details
    const [reports] = await db.promise().query(
      'SELECT * FROM reports WHERE id = ?',
      [result.insertId]
    );

    console.log('✅ Final report fetched:', reports[0]);

    res.status(201).json({
      success: true,
      message: 'Report created successfully',
      report: reports[0]
    });

  } catch (error) {
    console.error('❌ CREATE REPORT ERROR:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error creating report: ' + error.message 
    });
  }
};

<<<<<<< Updated upstream
// Update report status (Admin only)
const updateReportStatus = async (req, res) => {
=======
// --- UPDATE REPORT STATUS (Admin only) ---
exports.updateReportStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  console.log(`🔄 Updating report ${id} status to:`, status);

  // Validate status
  const validStatuses = ["pending", "under investigation", "resolved", "rejected"];
  if (!validStatuses.includes(status)) {
    return res.status(400).json({ 
      success: false,
      message: "Invalid status" 
    });
  }

>>>>>>> Stashed changes
  try {
    const { id } = req.params;
    const { status, note, notifyEmail, notifySMS } = req.body;

    // Check if report exists
    const [reports] = await db.promise().query(
      'SELECT * FROM reports WHERE id = ?',
      [id]
    );

    if (reports.length === 0) {
<<<<<<< Updated upstream
      return res.status(404).json({ message: 'Report not found' });
=======
      return res.status(404).json({
        success: false,
        message: "Report not found"
      });
>>>>>>> Stashed changes
    }

    // Update report status
    await db.promise().query(
      'UPDATE reports SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [status, id]
    );

    // Add status history
    await db.promise().query(
      'INSERT INTO status_history (report_id, status, note, changed_by) VALUES (?, ?, ?, ?)',
      [id, status, note || `Status changed to ${status}`, req.user.id]
    );

    // TODO: Implement email/SMS notifications here

    res.json({ message: 'Report status updated successfully' });

<<<<<<< Updated upstream
  } catch (error) {
    console.error('Update status error:', error);
    res.status(500).json({ message: 'Server error updating status' });
=======
    res.json({
      success: true,
      message: "Report status updated successfully",
      report: updatedReport
    });
  } catch (err) {
    console.error("❌ Update report status error:", err);
    res.status(500).json({ 
      success: false,
      message: "Server error updating report status",
      error: err.message
    });
>>>>>>> Stashed changes
  }
};

// Update report (User only for pending reports)
const updateReport = async (req, res) => {
  try {
<<<<<<< Updated upstream
    const { id } = req.params;
    const { title, description, location, coordinates } = req.body;

    // Check if report exists and belongs to user
    const [reports] = await db.promise().query(
      'SELECT * FROM reports WHERE id = ? AND user_id = ? AND status = "pending"',
      [id, req.user.id]
    );

    if (reports.length === 0) {
      return res.status(404).json({ message: 'Report not found or cannot be edited' });
    }

    // Parse coordinates
    let latitude = null, longitude = null;
    if (coordinates) {
      const [lat, lng] = coordinates.split(',').map(coord => parseFloat(coord.trim()));
      if (!isNaN(lat) && !isNaN(lng)) {
        latitude = lat;
        longitude = lng;
      }
=======
    const [report] = await db.query("SELECT * FROM reports WHERE id = ?", [id]);
    if (report.length === 0) {
      return res.status(404).json({ 
        success: false,
        message: "Report not found" 
      });
    }

    // Only admin or owner can delete
    if (userRole !== "admin" && report[0].user_id !== userId) {
      return res.status(403).json({ 
        success: false,
        message: "Unauthorized" 
      });
>>>>>>> Stashed changes
    }

    await db.promise().query(
      `UPDATE reports 
       SET title = ?, description = ?, location = ?, latitude = ?, longitude = ?, updated_at = CURRENT_TIMESTAMP 
       WHERE id = ?`,
      [title, description, location, latitude, longitude, id]
    );

<<<<<<< Updated upstream
    res.json({ message: 'Report updated successfully' });

  } catch (error) {
    console.error('Update report error:', error);
    res.status(500).json({ message: 'Server error updating report' });
=======
    res.json({ 
      success: true,
      message: "Report deleted successfully" 
    });
  } catch (err) {
    console.error("❌ Delete report error:", err);
    res.status(500).json({ 
      success: false,
      message: "Server error deleting report",
      error: err.message
    });
>>>>>>> Stashed changes
  }
};

// Delete report
const deleteReport = async (req, res) => {
  try {
    const { id } = req.params;

    let query = 'DELETE FROM reports WHERE id = ?';
    const params = [id];

    // If user is not admin, only allow deleting their own reports
    if (req.user.role === 'user') {
      query += ' AND user_id = ?';
      params.push(req.user.id);
    }

    const [result] = await db.promise().query(query, params);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Report not found or access denied' });
    }

    res.json({ message: 'Report deleted successfully' });

<<<<<<< Updated upstream
  } catch (error) {
    console.error('Delete report error:', error);
    res.status(500).json({ message: 'Server error deleting report' });
=======
    res.json({
      success: true,
      stats: formattedStats
    });
  } catch (err) {
    console.error("❌ Get report stats error:", err);
    res.status(500).json({
      success: false,
      message: "Server error fetching statistics",
      error: err.message
    });
>>>>>>> Stashed changes
  }
};

module.exports = {
  getReports,
  getReport,
  createReport,
  updateReportStatus,
  updateReport,
  deleteReport
};