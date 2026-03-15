const express = require("express");
const {
    generate,
    chat,
    review,
    templateFromImage,
    coverLetter,
    matchJob,
    rewriteBullet,
    genSummary,
    checkAts,
} = require("../controllers/aiController");
const { authenticate } = require("../middleware/auth");
const { aiLimiter, checkUsageLimits } = require("../middleware/rateLimiter");
const { uploadPdf, uploadImage } = require("../middleware/upload");

const router = express.Router();

// Existing endpoints
router.post("/generate", authenticate, aiLimiter, checkUsageLimits("ai"), generate);
router.post("/chat", authenticate, aiLimiter, checkUsageLimits("ai"), chat);
router.post("/review", authenticate, aiLimiter, checkUsageLimits("ai"), uploadPdf.single("resume"), review);
router.post("/template-from-image", authenticate, aiLimiter, checkUsageLimits("ai"), uploadImage.single("image"), templateFromImage);

// New AI endpoints
router.post("/cover-letter", authenticate, aiLimiter, checkUsageLimits("ai"), coverLetter);
router.post("/match-job", authenticate, aiLimiter, checkUsageLimits("ai"), matchJob);
router.post("/rewrite-bullet", authenticate, aiLimiter, checkUsageLimits("ai"), rewriteBullet);
router.post("/summary", authenticate, aiLimiter, checkUsageLimits("ai"), genSummary);
router.post("/ats-check", authenticate, aiLimiter, checkUsageLimits("ai"), checkAts);

module.exports = router;
