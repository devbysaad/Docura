const express = require("express");
const { generate, chat, review, templateFromImage } = require("../controllers/aiController");
const { authenticate } = require("../middleware/auth");
const { aiLimiter, checkUsageLimits } = require("../middleware/rateLimiter");
const { uploadPdf, uploadImage } = require("../middleware/upload");

const router = express.Router();

router.post("/generate", authenticate, aiLimiter, checkUsageLimits("ai"), generate);
router.post("/chat", authenticate, aiLimiter, checkUsageLimits("ai"), chat);
router.post("/review", authenticate, aiLimiter, checkUsageLimits("ai"), uploadPdf.single("resume"), review);
router.post("/template-from-image", authenticate, aiLimiter, checkUsageLimits("ai"), uploadImage.single("image"), templateFromImage);

module.exports = router;
