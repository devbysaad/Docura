import { API_BASE } from "../lib/utils";

export async function saveResume(data) {
    const res = await fetch(`${API_BASE}/resume`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    });
    if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || "Failed to save resume");
    }
    return res.json();
}

export async function getResume(id) {
    const res = await fetch(`${API_BASE}/resume/${id}`);
    if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || "Resume not found");
    }
    return res.json();
}

export async function generateResumePdf(data) {
    const token = localStorage.getItem("docura_token");
    const res = await fetch(`${API_BASE}/resume/generate-pdf`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(data),
    });
    if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || "Failed to generate PDF");
    }
    return res.blob();
}

export async function generateResumeDocx(data) {
    const token = localStorage.getItem("docura_token");
    const res = await fetch(`${API_BASE}/resume/generate-docx`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(data),
    });
    if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || "Failed to generate DOCX");
    }
    return res.blob();
}
