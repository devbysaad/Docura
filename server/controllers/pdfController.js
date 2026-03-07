const { createPdf } = require("../services/pdfService");

/**
 * POST /api/pdf/generate
 * Body: { text: string }
 * Response: application/pdf binary
 */
async function generatePdf(req, res) {
    try {
        const { text } = req.body;

        if (!text || typeof text !== "string" || text.trim().length === 0) {
            return res.status(400).json({ error: "Text is required." });
        }

        const pdfBytes = await createPdf(text);

        res.set({
            "Content-Type": "application/pdf",
            "Content-Disposition": 'attachment; filename="document.pdf"',
            "Content-Length": pdfBytes.length,
        });

        return res.send(Buffer.from(pdfBytes));
    } catch (err) {
        console.error("PDF generation error:", err);
        return res.status(500).json({ error: "Failed to generate PDF." });
    }
}

module.exports = { generatePdf };
