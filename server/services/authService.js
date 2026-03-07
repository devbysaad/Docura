const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const prisma = new PrismaClient();

async function createUser({ name, email, password }) {
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) throw new Error("Email already registered.");

    const hashed = await bcrypt.hash(password, 12);
    const user = await prisma.user.create({
        data: { name, email, password: hashed },
    });

    // Create initial usage record
    await prisma.usage.create({ data: { userId: user.id } });

    return { id: user.id, name: user.name, email: user.email, plan: user.plan };
}

async function loginUser({ email, password }) {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) throw new Error("Invalid email or password.");

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) throw new Error("Invalid email or password.");

    return { id: user.id, name: user.name, email: user.email, plan: user.plan };
}

function generateToken(user) {
    return jwt.sign(
        { id: user.id, email: user.email, plan: user.plan },
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
    );
}

async function getUserById(id) {
    const user = await prisma.user.findUnique({
        where: { id },
        select: { id: true, name: true, email: true, plan: true, createdAt: true },
    });
    return user;
}

module.exports = { createUser, loginUser, generateToken, getUserById };
