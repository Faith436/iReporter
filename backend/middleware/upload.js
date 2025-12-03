const multer = require("multer");
const path = require("path");
const fs = require("fs");

// --- Storage configuration ---
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let uploadPath = "uploads/";

    // Special case: avatar upload
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
    const fullPath = path.join(__dirname, "..", uploadPath);
    if (!fs.existsSync(fullPath)) {
      fs.mkdirSync(fullPath, { recursive: true });
      console.log(`🟢 Created folder: ${fullPath}`);
    }

    cb(null, fullPath);
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
    cb(null, false);
  }
};

// --- Multer instance ---
const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB
});

module.exports = upload;
