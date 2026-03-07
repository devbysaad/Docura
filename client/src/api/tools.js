import { API_BASE } from "../lib/utils";

function getAuthHeaders() {
    const token = localStorage.getItem("docura_token");
    return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function textToPdf(text) {
    const res = await fetch(`${API_BASE}/tools/text-to-pdf`, {
        method: "POST",
        headers: { "Content-Type": "application/json", ...getAuthHeaders() },
        body: JSON.stringify({ text }),
    });
    if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || "Conversion failed");
    }
    return res.blob();
}

export async function pdfToText(file) {
    const formData = new FormData();
    formData.append("pdf", file);
    const res = await fetch(`${API_BASE}/tools/pdf-to-text`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: formData,
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Extraction failed");
    return data;
}

export async function mergePdfs(files) {
    const formData = new FormData();
    files.forEach((f) => formData.append("pdfs", f));
    const res = await fetch(`${API_BASE}/tools/merge`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: formData,
    });
    if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || "Merge failed");
    }
    return res.blob();
}

export async function splitPdf(file, ranges) {
    const formData = new FormData();
    formData.append("pdf", file);
    if (ranges) formData.append("ranges", JSON.stringify(ranges));
    const res = await fetch(`${API_BASE}/tools/split`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: formData,
    });
    const contentType = res.headers.get("content-type");
    if (contentType?.includes("application/pdf")) {
        return { type: "blob", data: await res.blob() };
    }
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Split failed");
    return { type: "json", data };
}

export async function importResume(file) {
    const formData = new FormData();
    formData.append("resume", file);
    const res = await fetch(`${API_BASE}/tools/import-resume`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: formData,
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Import failed");
    return data;
}
