const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function listResumes(req, res) {
    try {
        const resumes = await prisma.resume.findMany({
            where: { userId: req.user.id },
            orderBy: { updatedAt: "desc" },
            select: {
                id: true,
                title: true,
                templateId: true,
                isDraft: true,
                createdAt: true,
                updatedAt: true,
            },
        });
        return res.json(resumes);
    } catch (err) {
        console.error("List resumes error:", err);
        return res.status(500).json({ error: "Failed to list resumes." });
    }
}

async function getResume(req, res) {
    try {
        const resume = await prisma.resume.findFirst({
            where: { id: req.params.id, userId: req.user.id },
        });
        if (!resume) return res.status(404).json({ error: "Resume not found." });
        return res.json(resume);
    } catch (err) {
        console.error("Get resume error:", err);
        return res.status(500).json({ error: "Failed to get resume." });
    }
}

async function createResume(req, res) {
    try {
        const { title, data, templateId } = req.body;
        const resume = await prisma.resume.create({
            data: {
                userId: req.user.id,
                title: title || "Untitled Resume",
                data: data || {},
                templateId: templateId || "modern-minimal",
            },
        });
        return res.status(201).json(resume);
    } catch (err) {
        console.error("Create resume error:", err);
        return res.status(500).json({ error: "Failed to create resume." });
    }
}

async function updateResume(req, res) {
    try {
        const { title, data, templateId, isDraft } = req.body;
        const existing = await prisma.resume.findFirst({
            where: { id: req.params.id, userId: req.user.id },
        });
        if (!existing) return res.status(404).json({ error: "Resume not found." });

        const resume = await prisma.resume.update({
            where: { id: req.params.id },
            data: {
                ...(title !== undefined && { title }),
                ...(data !== undefined && { data }),
                ...(templateId !== undefined && { templateId }),
                ...(isDraft !== undefined && { isDraft }),
            },
        });
        return res.json(resume);
    } catch (err) {
        console.error("Update resume error:", err);
        return res.status(500).json({ error: "Failed to update resume." });
    }
}

async function deleteResume(req, res) {
    try {
        const existing = await prisma.resume.findFirst({
            where: { id: req.params.id, userId: req.user.id },
        });
        if (!existing) return res.status(404).json({ error: "Resume not found." });

        await prisma.resume.delete({ where: { id: req.params.id } });
        return res.json({ message: "Resume deleted." });
    } catch (err) {
        console.error("Delete resume error:", err);
        return res.status(500).json({ error: "Failed to delete resume." });
    }
}

async function getUsageStats(req, res) {
    try {
        let usage = await prisma.usage.findUnique({
            where: { userId: req.user.id },
        });
        if (!usage) {
            usage = await prisma.usage.create({ data: { userId: req.user.id } });
        }

        const resumeCount = await prisma.resume.count({
            where: { userId: req.user.id },
        });

        return res.json({
            plan: req.user.plan,
            aiGenerations: usage.aiGenerations,
            downloads: usage.downloads,
            resumeCount,
            limits: req.user.plan === "pro"
                ? { ai: "unlimited", downloads: "unlimited" }
                : { ai: 5, downloads: 2 },
        });
    } catch (err) {
        console.error("Usage stats error:", err);
        return res.status(500).json({ error: "Failed to get usage stats." });
    }
}

async function getAiHistory(req, res) {
    try {
        const history = await prisma.aiHistory.findMany({
            where: { userId: req.user.id },
            orderBy: { createdAt: "desc" },
            take: 50,
            select: {
                id: true,
                type: true,
                prompt: true,
                createdAt: true,
            },
        });
        return res.json(history);
    } catch (err) {
        console.error("AI history error:", err);
        return res.status(500).json({ error: "Failed to get AI history." });
    }
}

module.exports = { listResumes, getResume, createResume, updateResume, deleteResume, getUsageStats, getAiHistory };
