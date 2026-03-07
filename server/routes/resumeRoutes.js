const express = require("express");
const router = express.Router();
const {
    createResume,
    getResume,
    generateResumePdf,
} = require("../controllers/resumeController");

router.post("/", createResume);
router.get("/:id", getResume);
router.post("/generate-pdf", generateResumePdf);

module.exports = router;
