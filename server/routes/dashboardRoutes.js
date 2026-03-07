const express = require("express");
const {
    listResumes,
    getResume,
    createResume,
    updateResume,
    deleteResume,
    getUsageStats,
    getAiHistory,
} = require("../controllers/dashboardController");
const { authenticate } = require("../middleware/auth");

const router = express.Router();

router.use(authenticate);

router.get("/resumes", listResumes);
router.get("/resumes/:id", getResume);
router.post("/resumes", createResume);
router.put("/resumes/:id", updateResume);
router.delete("/resumes/:id", deleteResume);
router.get("/stats", getUsageStats);
router.get("/ai-history", getAiHistory);

module.exports = router;
