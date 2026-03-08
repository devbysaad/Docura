const express = require("express");
const router = express.Router();
const {
    createResume,
    getResume,
    generateResumePdf,
    generateResumeDocx,
} = require("../controllers/resumeController");
const { optionalAuth } = require("../middleware/auth");

router.post("/", optionalAuth, createResume);
router.get("/:id", optionalAuth, getResume);
router.post("/generate-pdf", optionalAuth, generateResumePdf);
router.post("/generate-docx", optionalAuth, generateResumeDocx);

module.exports = router;
