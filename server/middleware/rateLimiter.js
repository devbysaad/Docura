const rateLimit = require("express-rate-limit");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

// General API rate limiter
const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100,
    message: { error: "Too many requests. Please try again later." },
    standardHeaders: true,
    legacyHeaders: false,
});

// AI endpoint rate limiter (stricter)
const aiLimiter = rateLimit({
    windowMs: 60 * 1000, // 1 minute
    max: 10,
    message: { error: "Too many AI requests. Please wait a moment." },
    standardHeaders: true,
    legacyHeaders: false,
});

// Check usage limits for free plan users
function checkUsageLimits(type) {
    return async (req, res, next) => {
        try {
            if (!req.user) return next();

            // Pro users have unlimited access
            if (req.user.plan === "pro") return next();

            let usage = await prisma.usage.findUnique({
                where: { userId: req.user.id },
            });

            if (!usage) {
                usage = await prisma.usage.create({
                    data: { userId: req.user.id },
                });
            }

            // Reset monthly
            const now = new Date();
            const resetDate = new Date(usage.resetAt);
            if (now.getMonth() !== resetDate.getMonth() || now.getFullYear() !== resetDate.getFullYear()) {
                usage = await prisma.usage.update({
                    where: { userId: req.user.id },
                    data: { aiGenerations: 0, downloads: 0, resetAt: now },
                });
            }

            if (type === "ai" && usage.aiGenerations >= 5) {
                return res.status(403).json({
                    error: "Free plan limit reached. You've used 5/5 AI generations this month.",
                    upgrade: true,
                });
            }

            if (type === "download" && usage.downloads >= 2) {
                return res.status(403).json({
                    error: "Free plan limit reached. You've used 2/2 downloads this month.",
                    upgrade: true,
                });
            }

            req.usage = usage;
            next();
        } catch (err) {
            console.error("Usage check error:", err);
            next();
        }
    };
}

// Increment usage after successful operation
async function incrementUsage(userId, type) {
    try {
        const field = type === "ai" ? "aiGenerations" : "downloads";
        await prisma.usage.upsert({
            where: { userId },
            update: { [field]: { increment: 1 } },
            create: { userId, [field]: 1 },
        });
    } catch (err) {
        console.error("Increment usage error:", err);
    }
}

module.exports = { apiLimiter, aiLimiter, checkUsageLimits, incrementUsage };
