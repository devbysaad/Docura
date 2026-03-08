const { PDFDocument, StandardFonts, rgb } = require("pdf-lib");

const PAGE_W = 595.28;
const PAGE_H = 841.89;
const MARGIN = 50;
const MAX_W = PAGE_W - MARGIN * 2;
const COLORS = {
    black: rgb(0.1, 0.1, 0.1),
    gray: rgb(0.4, 0.4, 0.4),
    lightGray: rgb(0.6, 0.6, 0.6),
    accent: rgb(0.31, 0.27, 0.9), // indigo
    line: rgb(0.85, 0.85, 0.85),
};

/* ── helpers ────────────────────────────────────────────── */

function wrapLine(text, font, fontSize, maxWidth) {
    // Split on newlines first — pdf-lib cannot encode \n
    const paragraphs = String(text).split(/\r?\n/);
    const lines = [];
    for (const para of paragraphs) {
        const cleaned = para.replace(/[\x00-\x1F\x7F]/g, ""); // strip all control chars
        if (!cleaned) { lines.push(""); continue; }
        const words = cleaned.split(" ");
        let cur = "";
        for (const w of words) {
            const test = cur ? `${cur} ${w}` : w;
            if (font.widthOfTextAtSize(test, fontSize) > maxWidth && cur) {
                lines.push(cur);
                cur = w;
            } else {
                cur = test;
            }
        }
        if (cur) lines.push(cur);
    }
    return lines;
}

function ensureSpace(ctx, need) {
    if (ctx.y - need < MARGIN) {
        ctx.page = ctx.doc.addPage([PAGE_W, PAGE_H]);
        ctx.y = PAGE_H - MARGIN;
    }
}

function drawText(ctx, text, { font, fontSize, color, x, maxWidth }) {
    const _x = x ?? MARGIN;
    const _mw = maxWidth ?? MAX_W;
    const lines = wrapLine(text, font, fontSize, _mw);
    const lh = fontSize * 1.5;
    for (const line of lines) {
        if (!line.trim()) { ctx.y -= lh * 0.5; continue; } // skip blank lines
        ensureSpace(ctx, lh);
        ctx.page.drawText(line, { x: _x, y: ctx.y - fontSize, size: fontSize, font, color });
        ctx.y -= lh;
    }
}

function drawHr(ctx) {
    ensureSpace(ctx, 12);
    ctx.y -= 6;
    ctx.page.drawLine({
        start: { x: MARGIN, y: ctx.y },
        end: { x: PAGE_W - MARGIN, y: ctx.y },
        thickness: 0.5,
        color: COLORS.line,
    });
    ctx.y -= 10;
}

function sectionTitle(ctx, title) {
    ctx.y -= 4;
    drawText(ctx, title.toUpperCase(), { font: ctx.bold, fontSize: 11, color: COLORS.accent });
    drawHr(ctx);
}

/* ── main ───────────────────────────────────────────────── */

async function createResumePdf(data) {
    const { basics = {}, skills = [], experience = [], projects = [], education = [] } = data;
    const doc = await PDFDocument.create();
    const regular = await doc.embedFont(StandardFonts.Helvetica);
    const bold = await doc.embedFont(StandardFonts.HelveticaBold);

    const page = doc.addPage([PAGE_W, PAGE_H]);
    const ctx = { doc, page, y: PAGE_H - MARGIN, bold, regular };

    /* ── Header ─────────────────────────────────────────── */
    if (basics.fullName) {
        drawText(ctx, basics.fullName, { font: bold, fontSize: 22, color: COLORS.black });
    }
    if (basics.profession) {
        drawText(ctx, basics.profession, { font: regular, fontSize: 12, color: COLORS.accent });
    }

    // Contact line
    const contactParts = [basics.email, basics.phone, basics.location].filter(Boolean);
    if (contactParts.length > 0) {
        drawText(ctx, contactParts.join("  |  "), { font: regular, fontSize: 9, color: COLORS.lightGray });
    }
    if (basics.portfolioUrl) {
        drawText(ctx, basics.portfolioUrl, { font: regular, fontSize: 9, color: COLORS.accent });
    }

    if (basics.summary) {
        ctx.y -= 4;
        drawText(ctx, basics.summary, { font: regular, fontSize: 10, color: COLORS.gray });
    }

    /* ── Skills ─────────────────────────────────────────── */
    if (skills.length > 0) {
        ctx.y -= 8;
        sectionTitle(ctx, "Skills");
        const joined = skills.filter(Boolean).join("  •  ");
        drawText(ctx, joined, { font: regular, fontSize: 10, color: COLORS.black });
    }

    /* ── Experience ─────────────────────────────────────── */
    if (experience.length > 0) {
        ctx.y -= 8;
        sectionTitle(ctx, "Work Experience");

        for (const exp of experience) {
            ensureSpace(ctx, 40);
            const title = [exp.role, exp.company].filter(Boolean).join(" — ");
            if (title) drawText(ctx, title, { font: bold, fontSize: 11, color: COLORS.black });
            const dates = [exp.startDate, exp.endDate].filter(Boolean).join(" – ");
            if (dates) drawText(ctx, dates, { font: regular, fontSize: 9, color: COLORS.lightGray });
            if (exp.description) {
                ctx.y -= 2;
                drawText(ctx, exp.description, { font: regular, fontSize: 10, color: COLORS.gray });
            }
            ctx.y -= 8;
        }
    }

    /* ── Projects ───────────────────────────────────────── */
    if (projects.length > 0) {
        ctx.y -= 4;
        sectionTitle(ctx, "Projects");

        for (const proj of projects) {
            ensureSpace(ctx, 40);
            if (proj.name) drawText(ctx, proj.name, { font: bold, fontSize: 11, color: COLORS.black });

            const links = [];
            if (proj.githubUrl) links.push(`GitHub: ${proj.githubUrl}`);
            if (proj.liveUrl) links.push(`Live: ${proj.liveUrl}`);
            if (links.length) drawText(ctx, links.join("   |   "), { font: regular, fontSize: 9, color: COLORS.accent });

            if (proj.summary) {
                ctx.y -= 2;
                drawText(ctx, proj.summary, { font: regular, fontSize: 10, color: COLORS.gray });
            }
            ctx.y -= 8;
        }
    }

    /* ── Education ──────────────────────────────────────── */
    if (education.length > 0) {
        ctx.y -= 4;
        sectionTitle(ctx, "Education");

        for (const ed of education) {
            ensureSpace(ctx, 30);
            const degree = [ed.degree, ed.field].filter(Boolean).join(" in ");
            if (degree) drawText(ctx, degree, { font: bold, fontSize: 11, color: COLORS.black });
            if (ed.school) drawText(ctx, ed.school, { font: regular, fontSize: 10, color: COLORS.gray });
            const dates = [ed.startDate, ed.endDate].filter(Boolean).join(" – ");
            if (dates) drawText(ctx, dates, { font: regular, fontSize: 9, color: COLORS.lightGray });
            ctx.y -= 8;
        }
    }

    return doc.save();
}

module.exports = { createResumePdf };
