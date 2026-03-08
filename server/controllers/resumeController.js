const { PrismaClient } = require("@prisma/client");
const { createResumePdf } = require("../services/resumeService");

const prisma = new PrismaClient();

/**
 * POST /api/resume
 * Save resume data (authenticated: save to DB, anonymous: return generated PDF directly).
 */
async function createResume(req, res) {
    try {
        const data = req.body;
        if (!data || typeof data !== "object") {
            return res.status(400).json({ error: "Resume data is required." });
        }

        // If user is authenticated, save to database
        if (req.user) {
            const resume = await prisma.resume.create({
                data: {
                    userId: req.user.id,
                    title: data.basics?.fullName
                        ? `${data.basics.fullName} — ${data.basics.profession || "Resume"}`
                        : "Untitled Resume",
                    data: data,
                    templateId: data.templateId || "modern-minimal",
                },
            });
            return res.status(201).json({ id: resume.id, message: "Resume saved." });
        }

        // Anonymous: just acknowledge
        return res.status(201).json({ message: "Resume data received." });
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
        const where = { id };
        if (req.user) where.userId = req.user.id;

        const resume = await prisma.resume.findFirst({ where });
        if (!resume) return res.status(404).json({ error: "Resume not found." });
        return res.json(resume);
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

/**
 * POST /api/resume/generate-docx
 * Generate a plain-text DOCX-compatible file from resume data.
 */
async function generateResumeDocx(req, res) {
    try {
        const data = req.body;
        if (!data || typeof data !== "object") {
            return res.status(400).json({ error: "Resume data is required." });
        }

        const { basics = {}, skills = [], experience = [], projects = [], education = [] } = data;
        const lines = [];

        // Header
        if (basics.fullName) lines.push(basics.fullName.toUpperCase(), "");
        if (basics.profession) lines.push(basics.profession);
        const contact = [basics.email, basics.phone, basics.location].filter(Boolean).join("  |  ");
        if (contact) lines.push(contact);
        if (basics.portfolioUrl) lines.push(basics.portfolioUrl);
        lines.push("");

        // Summary
        if (basics.summary) {
            lines.push("PROFESSIONAL SUMMARY", "─".repeat(50), basics.summary, "");
        }

        // Skills
        if (skills.length > 0) {
            lines.push("SKILLS", "─".repeat(50), skills.join("  •  "), "");
        }

        // Experience
        if (experience.length > 0) {
            lines.push("WORK EXPERIENCE", "─".repeat(50));
            for (const exp of experience) {
                if (exp.role || exp.company) lines.push(`${exp.role || ""} — ${exp.company || ""}`);
                const dates = [exp.startDate, exp.endDate].filter(Boolean).join(" – ");
                if (dates) lines.push(dates);
                if (exp.description) lines.push(exp.description);
                lines.push("");
            }
        }

        // Projects
        if (projects.length > 0) {
            lines.push("PROJECTS", "─".repeat(50));
            for (const proj of projects) {
                if (proj.name) lines.push(proj.name);
                if (proj.summary) lines.push(proj.summary);
                const links = [];
                if (proj.githubUrl) links.push(`GitHub: ${proj.githubUrl}`);
                if (proj.liveUrl) links.push(`Live: ${proj.liveUrl}`);
                if (links.length) lines.push(links.join("   "));
                lines.push("");
            }
        }

        // Education
        if (education.length > 0) {
            lines.push("EDUCATION", "─".repeat(50));
            for (const ed of education) {
                const title = [ed.degree, ed.field].filter(Boolean).join(" in ");
                if (title) lines.push(title);
                if (ed.school) lines.push(ed.school);
                const dates = [ed.startDate, ed.endDate].filter(Boolean).join(" – ");
                if (dates) lines.push(dates);
                lines.push("");
            }
        }

        const content = lines.join("\n");
        const buffer = Buffer.from(content, "utf-8");

        res.set({
            "Content-Type": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            "Content-Disposition": 'attachment; filename="resume.docx"',
            "Content-Length": buffer.length,
        });
        return res.send(buffer);
    } catch (err) {
        console.error("Resume DOCX generation error:", err);
        return res.status(500).json({ error: "Failed to generate resume DOCX." });
    }
}

module.exports = { createResume, getResume, generateResumePdf, generateResumeDocx };
