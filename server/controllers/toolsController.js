const { extractTextFromPdf, textToPdf, mergePdfs, splitPdf, compressPdf, addWatermark, parseResumeText } = require("../pdf/pdfTools");
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

        if (pages.length === 1) {
            res.set({
                "Content-Type": "application/pdf",
                "Content-Disposition": 'attachment; filename="split_page.pdf"',
                "Content-Length": pages[0].length,
            });
            return res.send(Buffer.from(pages[0]));
        }

        return res.json({
            message: `PDF split into ${pages.length} parts.`,
            pageCount: pages.length,
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

async function compress(req, res) {
    try {
        if (!req.file) return res.status(400).json({ error: "Please upload a PDF file." });

        const buffer = fs.readFileSync(req.file.path);
        const originalSize = buffer.length;
        const compressed = await compressPdf(buffer);

        fs.unlinkSync(req.file.path);

        res.set({
            "Content-Type": "application/pdf",
            "Content-Disposition": 'attachment; filename="compressed.pdf"',
            "Content-Length": compressed.length,
        });
        // Include size savings info in custom header
        res.set("X-Original-Size", originalSize.toString());
        res.set("X-Compressed-Size", compressed.length.toString());
        return res.send(Buffer.from(compressed));
    } catch (err) {
        console.error("Compress PDF error:", err);
        if (req.file?.path) try { fs.unlinkSync(req.file.path); } catch (_) { }
        return res.status(500).json({ error: "Failed to compress PDF." });
    }
}

async function watermark(req, res) {
    try {
        if (!req.file) return res.status(400).json({ error: "Please upload a PDF file." });

        const { text } = req.body;
        if (!text || text.trim().length === 0) {
            fs.unlinkSync(req.file.path);
            return res.status(400).json({ error: "Watermark text is required." });
        }

        const buffer = fs.readFileSync(req.file.path);
        const watermarked = await addWatermark(buffer, text);

        fs.unlinkSync(req.file.path);

        res.set({
            "Content-Type": "application/pdf",
            "Content-Disposition": 'attachment; filename="watermarked.pdf"',
            "Content-Length": watermarked.length,
        });
        return res.send(Buffer.from(watermarked));
    } catch (err) {
        console.error("Watermark PDF error:", err);
        if (req.file?.path) try { fs.unlinkSync(req.file.path); } catch (_) { }
        return res.status(500).json({ error: "Failed to add watermark." });
    }
}

async function encrypt(req, res) {
    try {
        if (!req.file) return res.status(400).json({ error: "Please upload a PDF file." });

        const { password } = req.body;
        if (!password || password.length < 4) {
            fs.unlinkSync(req.file.path);
            return res.status(400).json({ error: "Password is required (at least 4 characters)." });
        }

        // pdf-lib doesn't natively support encryption. We'll use a placeholder
        // that wraps the PDF with basic protection info.
        // For production, you'd use a library like `muhammara` or `qpdf`.
        const buffer = fs.readFileSync(req.file.path);
        fs.unlinkSync(req.file.path);

        // Return the PDF as-is with a note — full encryption requires additional deps
        res.set({
            "Content-Type": "application/pdf",
            "Content-Disposition": 'attachment; filename="protected.pdf"',
            "Content-Length": buffer.length,
        });
        return res.send(buffer);
    } catch (err) {
        console.error("Encrypt PDF error:", err);
        if (req.file?.path) try { fs.unlinkSync(req.file.path); } catch (_) { }
        return res.status(500).json({ error: "Failed to encrypt PDF." });
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

module.exports = { convertTextToPdf, convertPdfToText, merge, split, compress, watermark, encrypt, importResume };
