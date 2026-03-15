require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const { apiLimiter } = require("./middleware/rateLimiter");

const pdfRoutes = require("./routes/pdfRoutes");
const resumeRoutes = require("./routes/resumeRoutes");
const authRoutes = require("./routes/authRoutes");
const aiRoutes = require("./routes/aiRoutes");
const toolsRoutes = require("./routes/toolsRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");

const app = express();
const PORT = process.env.PORT || 5000;

// ── Startup validation ──────────────────────────────────
(function validateEnv() {
    const required = ["DATABASE_URL", "JWT_SECRET"];
    const missing = required.filter((k) => !process.env[k]);
    if (missing.length > 0) {
        console.error(`❌ Missing required env vars: ${missing.join(", ")}. Check your .env file.`);
        process.exit(1);
    }
    if (!process.env.GEMINI_API_KEY) {
        console.warn("⚠ GEMINI_API_KEY is not set — AI features will not work.");
    }
    console.log("✓ Environment variables validated");
})();

// Middleware
app.use(cors());
app.use(helmet());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// Rate limiting
app.use("/api/", apiLimiter);

// Health check
app.get("/", (req, res) => {
    res.json({ status: "ok", message: "Docura API is running." });
});

// Routes
app.use("/api/pdf", pdfRoutes);
app.use("/api/resume", resumeRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/tools", toolsRoutes);
app.use("/api/dashboard", dashboardRoutes);

// 404 handler
app.use((req, res) => {
    res.status(404).json({ error: "Route not found." });
});

// Global error handler
app.use((err, req, res, next) => {
    console.error("Unhandled error:", err);
    const statusCode = err.statusCode || 500;
    res.status(statusCode).json({
        error: process.env.NODE_ENV === "production"
            ? "Internal server error."
            : err.message || "Internal server error.",
    });
});

app.listen(PORT, () => {
    console.log(`🚀 Docura server running on port ${PORT}`);
});
