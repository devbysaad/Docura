import { API_BASE } from "../lib/utils";

function getHeaders() {
    const token = localStorage.getItem("docura_token");
    return {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
}

function getJsonHeaders() {
    const token = localStorage.getItem("docura_token");
    return {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
}

export async function textToPdf(text) {
    const res = await fetch(`${API_BASE}/tools/text-to-pdf`, {
        method: "POST",
        headers: getJsonHeaders(),
        body: JSON.stringify({ text }),
    });
    if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to convert text to PDF");
    }
    return res.blob();
}

export async function pdfToText(file) {
    const formData = new FormData();
    formData.append("pdf", file);
    const res = await fetch(`${API_BASE}/tools/pdf-to-text`, {
        method: "POST",
        headers: getHeaders(),
        body: formData,
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Failed to extract text");
    return data;
}

export async function mergePdfs(files) {
    const formData = new FormData();
    files.forEach((f) => formData.append("pdfs", f));
    const res = await fetch(`${API_BASE}/tools/merge`, {
        method: "POST",
        headers: getHeaders(),
        body: formData,
    });
    if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to merge PDFs");
    }
    return res.blob();
}

export async function splitPdf(file, ranges) {
    const formData = new FormData();
    formData.append("pdf", file);
    if (ranges) formData.append("ranges", JSON.stringify(ranges));
    const res = await fetch(`${API_BASE}/tools/split`, {
        method: "POST",
        headers: getHeaders(),
        body: formData,
    });
    const contentType = res.headers.get("Content-Type");
    if (contentType?.includes("application/pdf")) {
        return { type: "pdf", blob: await res.blob() };
    }
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Failed to split PDF");
    return { type: "json", data };
}

export async function compressPdf(file) {
    const formData = new FormData();
    formData.append("pdf", file);
    const res = await fetch(`${API_BASE}/tools/compress`, {
        method: "POST",
        headers: getHeaders(),
        body: formData,
    });
    if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to compress PDF");
    }
    return res.blob();
}

export async function watermarkPdf(file, text) {
    const formData = new FormData();
    formData.append("pdf", file);
    formData.append("text", text);
    const res = await fetch(`${API_BASE}/tools/watermark`, {
        method: "POST",
        headers: getHeaders(),
        body: formData,
    });
    if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to add watermark");
    }
    return res.blob();
}

export async function encryptPdf(file, password) {
    const formData = new FormData();
    formData.append("pdf", file);
    formData.append("password", password);
    const res = await fetch(`${API_BASE}/tools/encrypt`, {
        method: "POST",
        headers: getHeaders(),
        body: formData,
    });
    if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to encrypt PDF");
    }
    return res.blob();
}

export async function importResume(file) {
    const formData = new FormData();
    formData.append("resume", file);
    const res = await fetch(`${API_BASE}/tools/import-resume`, {
        method: "POST",
        headers: getHeaders(),
        body: formData,
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Failed to import resume");
    return data;
}
