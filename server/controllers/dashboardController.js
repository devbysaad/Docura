const { PrismaClient } = require("@prisma/client");
const crypto = require("crypto");

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
                version: true,
                parentId: true,
                downloadCount: true,
                publicSlug: true,
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

async function duplicateResume(req, res) {
    try {
        const original = await prisma.resume.findFirst({
            where: { id: req.params.id, userId: req.user.id },
        });
        if (!original) return res.status(404).json({ error: "Resume not found." });

        // Find the highest version for this resume chain
        const maxVersion = await prisma.resume.aggregate({
            where: {
                userId: req.user.id,
                OR: [
                    { id: original.id },
                    { parentId: original.parentId || original.id },
                ],
            },
            _max: { version: true },
        });

        const newVersion = (maxVersion._max.version || 1) + 1;

        const duplicate = await prisma.resume.create({
            data: {
                userId: req.user.id,
                title: `${original.title} (v${newVersion})`,
                data: original.data,
                templateId: original.templateId,
                isDraft: true,
                version: newVersion,
                parentId: original.parentId || original.id,
            },
        });

        return res.status(201).json(duplicate);
    } catch (err) {
        console.error("Duplicate resume error:", err);
        return res.status(500).json({ error: "Failed to duplicate resume." });
    }
}

async function togglePublicLink(req, res) {
    try {
        const existing = await prisma.resume.findFirst({
            where: { id: req.params.id, userId: req.user.id },
        });
        if (!existing) return res.status(404).json({ error: "Resume not found." });

        let publicSlug = existing.publicSlug;

        if (publicSlug) {
            // Disable public link
            await prisma.resume.update({
                where: { id: req.params.id },
                data: { publicSlug: null },
            });
            return res.json({ publicSlug: null, message: "Public link disabled." });
        } else {
            // Generate a short random slug
            publicSlug = crypto.randomBytes(6).toString("hex");
            await prisma.resume.update({
                where: { id: req.params.id },
                data: { publicSlug },
            });
            return res.json({ publicSlug, message: "Public link enabled." });
        }
    } catch (err) {
        console.error("Toggle public link error:", err);
        return res.status(500).json({ error: "Failed to toggle public link." });
    }
}

async function getPublicResume(req, res) {
    try {
        const resume = await prisma.resume.findFirst({
            where: { publicSlug: req.params.slug },
            select: {
                id: true,
                title: true,
                data: true,
                templateId: true,
                user: { select: { name: true } },
            },
        });
        if (!resume) return res.status(404).json({ error: "Resume not found." });
        return res.json(resume);
    } catch (err) {
        console.error("Get public resume error:", err);
        return res.status(500).json({ error: "Failed to get resume." });
    }
}

async function incrementDownload(req, res) {
    try {
        const resume = await prisma.resume.findFirst({
            where: { id: req.params.id, userId: req.user.id },
        });
        if (!resume) return res.status(404).json({ error: "Resume not found." });

        await prisma.resume.update({
            where: { id: req.params.id },
            data: { downloadCount: { increment: 1 } },
        });
        return res.json({ message: "Download tracked." });
    } catch (err) {
        console.error("Track download error:", err);
        return res.status(500).json({ error: "Failed to track download." });
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

        const totalDownloads = await prisma.resume.aggregate({
            where: { userId: req.user.id },
            _sum: { downloadCount: true },
        });

        return res.json({
            plan: req.user.plan,
            aiGenerations: usage.aiGenerations,
            downloads: usage.downloads,
            resumeCount,
            totalDownloads: totalDownloads._sum.downloadCount || 0,
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

module.exports = {
    listResumes,
    getResume,
    createResume,
    updateResume,
    deleteResume,
    duplicateResume,
    togglePublicLink,
    getPublicResume,
    incrementDownload,
    getUsageStats,
    getAiHistory,
};
