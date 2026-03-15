const { PDFDocument } = require("pdf-lib");
const pdfParse = require("pdf-parse");
const fs = require("fs");

/**
 * Extract text from a PDF file buffer.
 */
async function extractTextFromPdf(buffer) {
    const data = await pdfParse(buffer);
    return data.text;
}

/**
 * Convert plain text to a PDF (reuses existing pdfService logic).
 */
async function textToPdf(text) {
    const { createPdf } = require("../services/pdfService");
    return createPdf(text);
}

/**
 * Merge multiple PDF buffers into one.
 */
async function mergePdfs(buffers) {
    const mergedDoc = await PDFDocument.create();

    for (const buffer of buffers) {
        const srcDoc = await PDFDocument.load(buffer);
        const pages = await mergedDoc.copyPages(srcDoc, srcDoc.getPageIndices());
        pages.forEach((page) => mergedDoc.addPage(page));
    }

    return mergedDoc.save();
}

/**
 * Split a PDF into individual pages, returning an array of PDF buffers.
 */
async function splitPdf(buffer, ranges) {
    const srcDoc = await PDFDocument.load(buffer);
    const totalPages = srcDoc.getPageCount();
    const results = [];

    if (ranges && ranges.length > 0) {
        for (const range of ranges) {
            const newDoc = await PDFDocument.create();
            const start = Math.max(0, range.start);
            const end = Math.min(totalPages - 1, range.end);
            const indices = [];
            for (let i = start; i <= end; i++) indices.push(i);
            const pages = await newDoc.copyPages(srcDoc, indices);
            pages.forEach((page) => newDoc.addPage(page));
            results.push(await newDoc.save());
        }
    } else {
        for (let i = 0; i < totalPages; i++) {
            const newDoc = await PDFDocument.create();
            const [page] = await newDoc.copyPages(srcDoc, [i]);
            newDoc.addPage(page);
            results.push(await newDoc.save());
        }
    }

    return results;
}

/**
 * Compress a PDF by re-saving it (strips unused objects, metadata).
 */
async function compressPdf(buffer) {
    const srcDoc = await PDFDocument.load(buffer);
    return srcDoc.save({
        useObjectStreams: true,
        addDefaultPage: false,
    });
}

/**
 * Add a text watermark to every page of a PDF.
 */
async function addWatermark(buffer, text) {
    const { rgb, degrees, StandardFonts } = require("pdf-lib");
    const doc = await PDFDocument.load(buffer);
    const font = await doc.embedFont(StandardFonts.HelveticaBold);
    const pages = doc.getPages();

    for (const page of pages) {
        const { width, height } = page.getSize();
        const fontSize = Math.min(width, height) * 0.08;
        const textWidth = font.widthOfTextAtSize(text, fontSize);

        page.drawText(text, {
            x: (width - textWidth) / 2,
            y: height / 2,
            size: fontSize,
            font,
            color: rgb(0.7, 0.7, 0.7),
            opacity: 0.3,
            rotate: degrees(45),
        });
    }

    return doc.save();
}

/**
 * Parse resume text into structured data (best-effort extraction).
 */
function parseResumeText(text) {
    const lines = text.split("\n").map((l) => l.trim()).filter(Boolean);

    return {
        rawText: text,
        lineCount: lines.length,
        sections: extractSections(lines),
    };
}

function extractSections(lines) {
    const sectionHeaders = ["education", "experience", "skills", "projects", "summary", "contact", "work", "objective"];
    const sections = {};
    let currentSection = "header";
    let currentLines = [];

    for (const line of lines) {
        const lower = line.toLowerCase().replace(/[^a-z ]/g, "").trim();
        const isHeader = sectionHeaders.some((h) => lower === h || lower.startsWith(h));

        if (isHeader) {
            if (currentLines.length > 0) {
                sections[currentSection] = currentLines.join("\n");
            }
            currentSection = lower.split(" ")[0];
            currentLines = [];
        } else {
            currentLines.push(line);
        }
    }

    if (currentLines.length > 0) {
        sections[currentSection] = currentLines.join("\n");
    }

    return sections;
}

module.exports = { extractTextFromPdf, textToPdf, mergePdfs, splitPdf, compressPdf, addWatermark, parseResumeText };
