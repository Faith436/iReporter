const multer = require("multer");
const path = require("path");
const fs = require("fs");

// --- Storage configuration ---
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let uploadPath = "uploads/";

    if (req.route.path === "/profile" && file.fieldname === "avatar") {
      uploadPath += "avatars/";
    } else if (file.mimetype.startsWith("image/")) {
      uploadPath += "images/";
    } else if (file.mimetype.startsWith("video/")) {
      uploadPath += "videos/";
    } else {
      uploadPath += "others/";
    }

    // Ensure folder exists
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
      console.log(`🟢 Created folder: ${uploadPath}`);
    }

    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(
      null,
      file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname)
    );
  },
});

// --- File filter ---
const fileFilter = (req, file, cb) => {
  if (
    file.mimetype.startsWith("image/") ||
    file.mimetype.startsWith("video/")
  ) {
    cb(null, true);
  } else {
    console.warn(`⚠️ Skipped file (invalid type): ${file.originalname}`);
    cb(null, false); // skip invalid file instead of throwing
  }
};

// --- Multer instance ---
const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB
});

// --- Middleware wrapper ---
const uploadMiddleware = (req, res, next) => {
  // Use array to accept multiple files from field 'media'
  upload.array("media", 5)(req, res, (err) => {
    if (err) {
      console.error("Upload error:", err.message);
      return res.status(400).json({ error: err.message });
    }

    // Ensure req.body exists even if no text fields sent
    req.body = req.body || {};
    req.files = req.files || [];

    next();
  });
};

module.exports = uploadMiddleware;
