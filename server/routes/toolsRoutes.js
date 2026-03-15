const express = require("express");
const { convertTextToPdf, convertPdfToText, merge, split, compress, watermark, encrypt, importResume } = require("../controllers/toolsController");
const { optionalAuth } = require("../middleware/auth");
const { uploadPdf } = require("../middleware/upload");

const router = express.Router();

router.post("/text-to-pdf", optionalAuth, convertTextToPdf);
router.post("/pdf-to-text", optionalAuth, uploadPdf.single("pdf"), convertPdfToText);
router.post("/merge", optionalAuth, uploadPdf.array("pdfs", 10), merge);
router.post("/split", optionalAuth, uploadPdf.single("pdf"), split);
router.post("/compress", optionalAuth, uploadPdf.single("pdf"), compress);
router.post("/watermark", optionalAuth, uploadPdf.single("pdf"), watermark);
router.post("/encrypt", optionalAuth, uploadPdf.single("pdf"), encrypt);
router.post("/import-resume", optionalAuth, uploadPdf.single("resume"), importResume);

module.exports = router;
