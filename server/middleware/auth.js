const jwt = require("jsonwebtoken");

function authenticate(req, res, next) {
    try {
        const header = req.headers.authorization;
        if (!header || !header.startsWith("Bearer ")) {
            return res.status(401).json({ error: "Authentication required." });
        }

        const token = header.split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = { id: decoded.id, email: decoded.email, plan: decoded.plan };
        next();
    } catch (err) {
        return res.status(401).json({ error: "Invalid or expired token." });
    }
}

// Optional auth — attaches user if token present, but doesn't block
function optionalAuth(req, res, next) {
    try {
        const header = req.headers.authorization;
        if (header && header.startsWith("Bearer ")) {
            const token = header.split(" ")[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = { id: decoded.id, email: decoded.email, plan: decoded.plan };
        }
    } catch (_) {
        // ignore
    }
    next();
}

module.exports = { authenticate, optionalAuth };
