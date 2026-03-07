const { generateResumeContent, chatWithAssistant, reviewResume, analyzeTemplateImage } = require("../services/aiService");
const { incrementUsage } = require("../middleware/rateLimiter");
const pdfParse = require("pdf-parse");
const fs = require("fs");

function getAiErrorResponse(err) {
    const msg = err.message || "AI operation failed";

    if (msg.includes("rate limit") || msg.includes("quota") || err.status === 429) {
        return { status: 429, error: "AI rate limit exceeded. Please wait a moment and try again." };
    }
    if (msg.includes("not configured") || msg.includes("API key")) {
        return { status: 503, error: "AI service is not configured. Please contact the administrator." };
    }
    if (msg.includes("not found") || err.status === 404) {
        return { status: 503, error: "AI model unavailable. Please try again later." };
    }
    return { status: 500, error: "AI generation failed. " + msg };
}

async function generate(req, res) {
    try {
        const { description } = req.body;
        if (!description || description.trim().length < 5) {
            return res.status(400).json({ error: "Please provide a description (at least 5 characters)." });
        }

        const result = await generateResumeContent(description, req.user?.id);
        await incrementUsage(req.user.id, "ai");

        return res.json(result);
    } catch (err) {
        console.error("AI generate error:", err.message);
        const { status, error } = getAiErrorResponse(err);
        return res.status(status).json({ error });
    }
}

async function chat(req, res) {
    try {
        const { message, resumeData, history } = req.body;
        if (!message || message.trim().length === 0) {
            return res.status(400).json({ error: "Message is required." });
        }

        const response = await chatWithAssistant(message, resumeData, history, req.user?.id);
        await incrementUsage(req.user.id, "ai");

        return res.json({ response });
    } catch (err) {
        console.error("AI chat error:", err.message);
        const { status, error } = getAiErrorResponse(err);
        return res.status(status).json({ error });
    }
}

async function review(req, res) {
    try {
        const { jobDescription } = req.body;
        const file = req.file;

        if (!file) {
            return res.status(400).json({ error: "Please upload a PDF resume." });
        }

        const fileBuffer = fs.readFileSync(file.path);
        const parsed = await pdfParse(fileBuffer);
        const pdfText = parsed.text;

        if (!pdfText || pdfText.trim().length < 20) {
            return res.status(400).json({ error: "Could not extract text from the PDF. Make sure it's not a scanned image." });
        }

        const result = await reviewResume(pdfText, jobDescription, req.user?.id);
        await incrementUsage(req.user.id, "ai");

        // Clean up uploaded file
        fs.unlinkSync(file.path);

        return res.json(result);
    } catch (err) {
        console.error("AI review error:", err.message);
        if (req.file?.path) {
            try { fs.unlinkSync(req.file.path); } catch (_) { }
        }
        const { status, error } = getAiErrorResponse(err);
        return res.status(status).json({ error });
    }
}

async function templateFromImage(req, res) {
    try {
        const file = req.file;
        if (!file) {
            return res.status(400).json({ error: "Please upload an image of a resume template." });
        }

        const result = await analyzeTemplateImage(file.path, req.user?.id);
        await incrementUsage(req.user.id, "ai");

        // Clean up
        fs.unlinkSync(file.path);

        return res.json(result);
    } catch (err) {
        console.error("Template from image error:", err.message);
        if (req.file?.path) {
            try { fs.unlinkSync(req.file.path); } catch (_) { }
        }
        const { status, error } = getAiErrorResponse(err);
        return res.status(status).json({ error });
    }
}

module.exports = { generate, chat, review, templateFromImage };
