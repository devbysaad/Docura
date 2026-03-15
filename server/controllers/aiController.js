const {
    generateResumeContent,
    chatWithAssistant,
    reviewResume,
    analyzeTemplateImage,
    generateCoverLetter,
    matchJobDescription,
    rewriteBulletPoint,
    generateSummary,
    atsCheck,
} = require("../services/aiService");
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
    if (msg.includes("invalid JSON") || msg.includes("JSON parse")) {
        return { status: 502, error: "AI returned an unexpected response. Please try again." };
    }
    return { status: 500, error: "AI generation failed. " + msg };
}

async function generate(req, res) {
    try {
        const { description, tone } = req.body;
        if (!description || description.trim().length < 5) {
            return res.status(400).json({ error: "Please provide a description (at least 5 characters)." });
        }

        const result = await generateResumeContent(description, req.user?.id, tone);
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

        console.log(`[AI Review] File received: ${file.originalname}, size: ${file.size}, path: ${file.path || "memory"}`);

        let fileBuffer;
        if (file.buffer) {
            fileBuffer = file.buffer;
        } else if (file.path) {
            fileBuffer = fs.readFileSync(file.path);
        } else {
            return res.status(400).json({ error: "Could not read uploaded file." });
        }

        let pdfText = "";
        try {
            const parsed = await pdfParse(fileBuffer, { max: 0 });
            pdfText = parsed.text || "";
            console.log(`[AI Review] PDF parsed successfully, text length: ${pdfText.length}`);
        } catch (parseErr) {
            console.error("PDF parse error:", parseErr.message);
            return res.status(400).json({ error: "Could not parse the PDF. Make sure it's a valid PDF file (not scanned/image-only)." });
        }

        // Clean up uploaded file from disk
        if (file.path) {
            try { fs.unlinkSync(file.path); } catch (_) { }
        }

        if (!pdfText || pdfText.trim().length < 20) {
            return res.status(400).json({ error: "Could not extract enough text from the PDF. Make sure it's not a scanned image." });
        }

        const result = await reviewResume(pdfText, jobDescription, req.user?.id);
        await incrementUsage(req.user.id, "ai");

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

        console.log(`[AI Template] File received: ${file.originalname}, size: ${file.size}, path: ${file.path}`);

        if (!file.path) {
            return res.status(400).json({ error: "File upload failed — no file path. Check multer config." });
        }

        const result = await analyzeTemplateImage(file.path, req.user?.id);
        await incrementUsage(req.user.id, "ai");

        // Clean up
        try { fs.unlinkSync(file.path); } catch (_) { }

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

async function coverLetter(req, res) {
    try {
        const { resumeData, jobDescription, tone } = req.body;
        if (!resumeData || !jobDescription) {
            return res.status(400).json({ error: "Resume data and job description are required." });
        }

        const result = await generateCoverLetter(resumeData, jobDescription, req.user?.id, tone);
        await incrementUsage(req.user.id, "ai");

        return res.json({ coverLetter: result });
    } catch (err) {
        console.error("Cover letter error:", err.message);
        const { status, error } = getAiErrorResponse(err);
        return res.status(status).json({ error });
    }
}

async function matchJob(req, res) {
    try {
        const { resumeData, jobDescription } = req.body;
        if (!resumeData || !jobDescription) {
            return res.status(400).json({ error: "Resume data and job description are required." });
        }

        const result = await matchJobDescription(resumeData, jobDescription, req.user?.id);
        await incrementUsage(req.user.id, "ai");

        return res.json(result);
    } catch (err) {
        console.error("Match job error:", err.message);
        const { status, error } = getAiErrorResponse(err);
        return res.status(status).json({ error });
    }
}

async function rewriteBullet(req, res) {
    try {
        const { text, tone } = req.body;
        if (!text || text.trim().length < 5) {
            return res.status(400).json({ error: "Please provide bullet point text (at least 5 characters)." });
        }

        const result = await rewriteBulletPoint(text, tone, req.user?.id);
        await incrementUsage(req.user.id, "ai");

        return res.json(result);
    } catch (err) {
        console.error("Rewrite bullet error:", err.message);
        const { status, error } = getAiErrorResponse(err);
        return res.status(status).json({ error });
    }
}

async function genSummary(req, res) {
    try {
        const { resumeData, tone } = req.body;
        if (!resumeData) {
            return res.status(400).json({ error: "Resume data is required." });
        }

        const result = await generateSummary(resumeData, req.user?.id, tone);
        await incrementUsage(req.user.id, "ai");

        return res.json(result);
    } catch (err) {
        console.error("Generate summary error:", err.message);
        const { status, error } = getAiErrorResponse(err);
        return res.status(status).json({ error });
    }
}

async function checkAts(req, res) {
    try {
        const { resumeData, jobDescription } = req.body;
        if (!resumeData) {
            return res.status(400).json({ error: "Resume data is required." });
        }

        const result = await atsCheck(resumeData, jobDescription, req.user?.id);
        await incrementUsage(req.user.id, "ai");

        return res.json(result);
    } catch (err) {
        console.error("ATS check error:", err.message);
        const { status, error } = getAiErrorResponse(err);
        return res.status(status).json({ error });
    }
}

module.exports = {
    generate,
    chat,
    review,
    templateFromImage,
    coverLetter,
    matchJob,
    rewriteBullet,
    genSummary,
    checkAts,
};
