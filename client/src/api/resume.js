const API_BASE = "http://localhost:5000/api/resume";

export async function saveResume(data) {
    const res = await fetch(API_BASE, {
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
    const res = await fetch(`${API_BASE}/${id}`);
    if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || "Resume not found");
    }
    return res.json();
}

export async function generateResumePdf(data) {
    const res = await fetch(`${API_BASE}/generate-pdf`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    });
    if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || "Failed to generate PDF");
    }
    return res.blob();
}
