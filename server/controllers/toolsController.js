const { extractTextFromPdf, textToPdf, mergePdfs, splitPdf, parseResumeText } = require("../pdf/pdfTools");
const fs = require("fs");

async function convertTextToPdf(req, res) {
    try {
        const { text } = req.body;
        if (!text || text.trim().length === 0) {
            return res.status(400).json({ error: "Text content is required." });
        }

        const pdfBytes = await textToPdf(text);
        res.set({
            "Content-Type": "application/pdf",
            "Content-Disposition": 'attachment; filename="document.pdf"',
            "Content-Length": pdfBytes.length,
        });
        return res.send(Buffer.from(pdfBytes));
    } catch (err) {
        console.error("Text to PDF error:", err);
        return res.status(500).json({ error: "Failed to convert text to PDF." });
    }
}

async function convertPdfToText(req, res) {
    try {
        if (!req.file) return res.status(400).json({ error: "Please upload a PDF file." });

        const buffer = fs.readFileSync(req.file.path);
        const text = await extractTextFromPdf(buffer);

        fs.unlinkSync(req.file.path);
        return res.json({ text });
    } catch (err) {
        console.error("PDF to text error:", err);
        if (req.file?.path) try { fs.unlinkSync(req.file.path); } catch (_) { }
        return res.status(500).json({ error: "Failed to extract text from PDF." });
    }
}

async function merge(req, res) {
    try {
        if (!req.files || req.files.length < 2) {
            return res.status(400).json({ error: "At least 2 PDF files are required." });
        }

        const buffers = req.files.map((f) => fs.readFileSync(f.path));
        const merged = await mergePdfs(buffers);

        // Clean up
        req.files.forEach((f) => { try { fs.unlinkSync(f.path); } catch (_) { } });

        res.set({
            "Content-Type": "application/pdf",
            "Content-Disposition": 'attachment; filename="merged.pdf"',
            "Content-Length": merged.length,
        });
        return res.send(Buffer.from(merged));
    } catch (err) {
        console.error("Merge PDFs error:", err);
        if (req.files) req.files.forEach((f) => { try { fs.unlinkSync(f.path); } catch (_) { } });
        return res.status(500).json({ error: "Failed to merge PDFs." });
    }
}

async function split(req, res) {
    try {
        if (!req.file) return res.status(400).json({ error: "Please upload a PDF file." });

        const buffer = fs.readFileSync(req.file.path);
        const { ranges } = req.body;
        const parsedRanges = ranges ? JSON.parse(ranges) : null;
        const pages = await splitPdf(buffer, parsedRanges);

        fs.unlinkSync(req.file.path);

        // Return first split (for simplicity — in production you'd zip them)
        if (pages.length === 1) {
            res.set({
                "Content-Type": "application/pdf",
                "Content-Disposition": 'attachment; filename="split_page.pdf"',
                "Content-Length": pages[0].length,
            });
            return res.send(Buffer.from(pages[0]));
        }

        // Return info about splits
        return res.json({
            message: `PDF split into ${pages.length} parts.`,
            pageCount: pages.length,
            // Encode first 3 pages as base64 for preview
            pages: pages.slice(0, 3).map((p, i) => ({
                index: i,
                base64: Buffer.from(p).toString("base64"),
            })),
        });
    } catch (err) {
        console.error("Split PDF error:", err);
        if (req.file?.path) try { fs.unlinkSync(req.file.path); } catch (_) { }
        return res.status(500).json({ error: "Failed to split PDF." });
    }
}

async function importResume(req, res) {
    try {
        if (!req.file) return res.status(400).json({ error: "Please upload a PDF resume." });

        const buffer = fs.readFileSync(req.file.path);
        const text = await extractTextFromPdf(buffer);
        const parsed = parseResumeText(text);

        fs.unlinkSync(req.file.path);
        return res.json(parsed);
    } catch (err) {
        console.error("Import resume error:", err);
        if (req.file?.path) try { fs.unlinkSync(req.file.path); } catch (_) { }
        return res.status(500).json({ error: "Failed to import resume." });
    }
}

module.exports = { convertTextToPdf, convertPdfToText, merge, split, importResume };
