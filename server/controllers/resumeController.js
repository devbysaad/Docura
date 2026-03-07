const { createResumePdf } = require("../services/resumeService");
const crypto = require("crypto");

// Simple in-memory store
const store = new Map();

/**
 * POST /api/resume
 * Save resume data and return an ID.
 */
async function createResume(req, res) {
    try {
        const data = req.body;
        if (!data || typeof data !== "object") {
            return res.status(400).json({ error: "Resume data is required." });
        }
        const id = crypto.randomUUID();
        store.set(id, data);
        return res.status(201).json({ id, message: "Resume saved." });
    } catch (err) {
        console.error("Create resume error:", err);
        return res.status(500).json({ error: "Failed to save resume." });
    }
}

/**
 * GET /api/resume/:id
 * Retrieve resume data by ID.
 */
async function getResume(req, res) {
    try {
        const { id } = req.params;
        const data = store.get(id);
        if (!data) return res.status(404).json({ error: "Resume not found." });
        return res.json(data);
    } catch (err) {
        console.error("Get resume error:", err);
        return res.status(500).json({ error: "Failed to retrieve resume." });
    }
}

/**
 * POST /api/resume/generate-pdf
 * Generate PDF from resume data and return it.
 */
async function generateResumePdf(req, res) {
    try {
        const data = req.body;
        if (!data || typeof data !== "object") {
            return res.status(400).json({ error: "Resume data is required." });
        }
        const pdfBytes = await createResumePdf(data);
        res.set({
            "Content-Type": "application/pdf",
            "Content-Disposition": 'attachment; filename="resume.pdf"',
            "Content-Length": pdfBytes.length,
        });
        return res.send(Buffer.from(pdfBytes));
    } catch (err) {
        console.error("Resume PDF generation error:", err);
        return res.status(500).json({ error: "Failed to generate resume PDF." });
    }
}

module.exports = { createResume, getResume, generateResumePdf };
