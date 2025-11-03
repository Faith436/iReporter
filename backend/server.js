// server.js
const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const dotenv = require("dotenv");
const fs = require("fs"); 
dotenv.config();

const authRoutes = require("./routes/auth");
const reportRoutes = require("./routes/reportRoutes"); 
const notificationRoutes = require("./routes/notifications");

const app = express();

// --- Ensure upload directories exist ---
['uploads/images', 'uploads/videos', 'uploads/others'].forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    console.log(`🟢 Created directory: ${dir}`);
  }
});

// --- CORS (must come before routes) ---
app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:3000"],
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

// --- Middleware ---
app.use(express.json());
app.use(cookieParser());
app.use("/uploads", express.static("uploads"));

// --- Routes ---
app.use("/api/auth", authRoutes);
app.use("/api/reports", reportRoutes); 
app.use("/api/notifications", notificationRoutes);

// --- Test route ---
app.get("/", (req, res) => {
  res.send("API running... authentication + reports routes ready ✅");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
