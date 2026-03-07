const express = require("express");
const { convertTextToPdf, convertPdfToText, merge, split, importResume } = require("../controllers/toolsController");
const { optionalAuth } = require("../middleware/auth");
const { uploadPdf } = require("../middleware/upload");

const router = express.Router();

router.post("/text-to-pdf", optionalAuth, convertTextToPdf);
router.post("/pdf-to-text", optionalAuth, uploadPdf.single("pdf"), convertPdfToText);
router.post("/merge", optionalAuth, uploadPdf.array("pdfs", 10), merge);
router.post("/split", optionalAuth, uploadPdf.single("pdf"), split);
router.post("/import-resume", optionalAuth, uploadPdf.single("resume"), importResume);

module.exports = router;
