import { API_BASE } from "../lib/utils";

function getHeaders() {
    const token = localStorage.getItem("docura_token");
    return {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
}

function getAuthHeaders() {
    const token = localStorage.getItem("docura_token");
    return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function listResumes() {
    const res = await fetch(`${API_BASE}/dashboard/resumes`, { headers: getHeaders() });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Failed to list resumes");
    return data;
}

export async function getResume(id) {
    const res = await fetch(`${API_BASE}/dashboard/resumes/${id}`, { headers: getHeaders() });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Failed to get resume");
    return data;
}

export async function createResume(body) {
    const res = await fetch(`${API_BASE}/dashboard/resumes`, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify(body),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Failed to create resume");
    return data;
}

export async function updateResume(id, body) {
    const res = await fetch(`${API_BASE}/dashboard/resumes/${id}`, {
        method: "PUT",
        headers: getHeaders(),
        body: JSON.stringify(body),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Failed to update resume");
    return data;
}

export async function deleteResume(id) {
    const res = await fetch(`${API_BASE}/dashboard/resumes/${id}`, {
        method: "DELETE",
        headers: getHeaders(),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Failed to delete resume");
    return data;
}

export async function duplicateResume(id) {
    const res = await fetch(`${API_BASE}/dashboard/resumes/${id}/duplicate`, {
        method: "POST",
        headers: getHeaders(),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Failed to duplicate resume");
    return data;
}

export async function togglePublicLink(id) {
    const res = await fetch(`${API_BASE}/dashboard/resumes/${id}/toggle-public`, {
        method: "POST",
        headers: getHeaders(),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Failed to toggle public link");
    return data;
}

export async function trackDownload(id) {
    const res = await fetch(`${API_BASE}/dashboard/resumes/${id}/track-download`, {
        method: "POST",
        headers: getHeaders(),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Failed to track download");
    return data;
}

export async function getPublicResume(slug) {
    const res = await fetch(`${API_BASE}/dashboard/public/${slug}`);
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Resume not found");
    return data;
}

export async function getUsageStats() {
    const res = await fetch(`${API_BASE}/dashboard/stats`, { headers: getHeaders() });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Failed to get usage stats");
    return data;
}

export async function getAiHistory() {
    const res = await fetch(`${API_BASE}/dashboard/ai-history`, { headers: getHeaders() });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Failed to get AI history");
    return data;
}
