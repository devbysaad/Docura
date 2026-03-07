require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const path = require("path");
const pdfRoutes = require("./routes/pdfRoutes");
const resumeRoutes = require("./routes/resumeRoutes");
const authRoutes = require("./routes/authRoutes");
const aiRoutes = require("./routes/aiRoutes");
const toolsRoutes = require("./routes/toolsRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const { apiLimiter } = require("./middleware/rateLimiter");

const app = express();
const PORT = process.env.PORT || 5000;

// Security
app.use(helmet({ crossOriginResourcePolicy: { policy: "cross-origin" } }));
app.use(cors());

// Body parsing
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Static files
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Rate limiting
app.use("/api", apiLimiter);

// Routes
app.use("/api/pdf", pdfRoutes);
app.use("/api/resume", resumeRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/tools", toolsRoutes);
app.use("/api/dashboard", dashboardRoutes);

// Health check
app.get("/", (_req, res) => {
    res.json({ status: "ok", message: "Docura API is running." });
});

app.listen(PORT, () => {
    console.log(`🚀 Docura server running on http://localhost:${PORT}`);
});
