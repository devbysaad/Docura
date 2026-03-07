const express = require("express");
const cors = require("cors");
const pdfRoutes = require("./routes/pdfRoutes");
const resumeRoutes = require("./routes/resumeRoutes");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json({ limit: "5mb" }));

// Routes
app.use("/api/pdf", pdfRoutes);
app.use("/api/resume", resumeRoutes);

// Health check
app.get("/", (_req, res) => {
    res.json({ status: "ok", message: "PDF Converter API is running." });
});

app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});
