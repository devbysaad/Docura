const { createUser, loginUser, generateToken, getUserById } = require("../services/authService");

async function register(req, res) {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ error: "Name, email and password are required." });
        }
        if (password.length < 6) {
            return res.status(400).json({ error: "Password must be at least 6 characters." });
        }

        const user = await createUser({ name, email, password });
        const token = generateToken(user);

        return res.status(201).json({ user, token });
    } catch (err) {
        if (err.message === "Email already registered.") {
            return res.status(409).json({ error: err.message });
        }
        console.error("Register error:", err);
        return res.status(500).json({ error: "Registration failed." });
    }
}

async function login(req, res) {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: "Email and password are required." });
        }

        const user = await loginUser({ email, password });
        const token = generateToken(user);

        return res.json({ user, token });
    } catch (err) {
        if (err.message === "Invalid email or password.") {
            return res.status(401).json({ error: err.message });
        }
        console.error("Login error:", err);
        return res.status(500).json({ error: "Login failed." });
    }
}

async function getProfile(req, res) {
    try {
        const user = await getUserById(req.user.id);
        if (!user) return res.status(404).json({ error: "User not found." });
        return res.json(user);
    } catch (err) {
        console.error("Profile error:", err);
        return res.status(500).json({ error: "Failed to get profile." });
    }
}

module.exports = { register, login, getProfile };
