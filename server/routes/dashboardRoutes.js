const express = require("express");
const {
    listResumes,
    getResume,
    createResume,
    updateResume,
    deleteResume,
    duplicateResume,
    togglePublicLink,
    getPublicResume,
    incrementDownload,
    getUsageStats,
    getAiHistory,
} = require("../controllers/dashboardController");
const { authenticate } = require("../middleware/auth");

const router = express.Router();

// Public route — no auth required
router.get("/public/:slug", getPublicResume);

// All other routes require authentication
router.use(authenticate);

router.get("/resumes", listResumes);
router.get("/resumes/:id", getResume);
router.post("/resumes", createResume);
router.put("/resumes/:id", updateResume);
router.delete("/resumes/:id", deleteResume);
router.post("/resumes/:id/duplicate", duplicateResume);
router.post("/resumes/:id/toggle-public", togglePublicLink);
router.post("/resumes/:id/track-download", incrementDownload);
router.get("/stats", getUsageStats);
router.get("/ai-history", getAiHistory);

module.exports = router;
