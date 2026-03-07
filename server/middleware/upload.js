const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, "..", "uploads");
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: (_req, _file, cb) => cb(null, uploadsDir),
    filename: (_req, file, cb) => {
        const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
        const ext = path.extname(file.originalname);
        cb(null, `${unique}${ext}`);
    },
});

// File filters
const imageFilter = (_req, file, cb) => {
    const allowed = /\.(jpg|jpeg|png|gif|webp|svg)$/i;
    if (allowed.test(path.extname(file.originalname))) {
        cb(null, true);
    } else {
        cb(new Error("Only image files are allowed."), false);
    }
};

const pdfFilter = (_req, file, cb) => {
    if (path.extname(file.originalname).toLowerCase() === ".pdf") {
        cb(null, true);
    } else {
        cb(new Error("Only PDF files are allowed."), false);
    }
};

const docFilter = (_req, file, cb) => {
    const allowed = /\.(pdf|doc|docx)$/i;
    if (allowed.test(path.extname(file.originalname))) {
        cb(null, true);
    } else {
        cb(new Error("Only PDF and Word documents are allowed."), false);
    }
};

const uploadImage = multer({ storage, fileFilter: imageFilter, limits: { fileSize: 5 * 1024 * 1024 } });
const uploadPdf = multer({ storage, fileFilter: pdfFilter, limits: { fileSize: 20 * 1024 * 1024 } });
const uploadDoc = multer({ storage, fileFilter: docFilter, limits: { fileSize: 20 * 1024 * 1024 } });

module.exports = { uploadImage, uploadPdf, uploadDoc };
