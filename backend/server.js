const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");
const fs = require("fs");

dotenv.config();

const authRoutes = require("./routes/auth");
const reportRoutes = require("./routes/reportRoutes");
const notificationRoutes = require("./routes/notifications");
const userRoutes = require("./routes/users");

const app = express();

// --- Ensure local upload directories exist for non-avatar files ---
["uploads/images", "uploads/videos", "uploads/others"].forEach((dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    console.log(`🟢 Created directory: ${dir}`);
  }
});

// --- CORS configuration ---
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:3000",
      "https://ireporter-phi.vercel.app",
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

// --- Body parsing ---
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// --- Catch invalid JSON body ---
app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
    return res.status(400).json({
      success: false,
      message: "Invalid JSON format",
    });
  }
  next();
});

// --- Cookie parser ---
app.use(cookieParser());

// --- Static folders for images/videos/other uploads ---
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// --- Routes ---
app.use("/api/auth", authRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/reports", reportRoutes); // Multer used inside reportRoutes
app.use("/api/users", userRoutes);     // Cloudinary handled inside userRoutes

// --- Test route ---
app.get("/", (req, res) => {
  res.send("API running... authentication + reports routes ready ✅");
});

// --- Check SendGrid key ---
console.log(
  "SendGrid API Key Loaded:",
  process.env.SENDGRID_API_KEY?.startsWith("SG.")
);

// --- Start server ---
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
