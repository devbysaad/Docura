import { API_BASE } from "../lib/utils";

function getHeaders() {
    const token = localStorage.getItem("docura_token");
    return {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
}

export async function listResumes() {
    const res = await fetch(`${API_BASE}/dashboard/resumes`, { headers: getHeaders() });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Failed to list resumes");
    return data;
}

export async function getResumeById(id) {
    const res = await fetch(`${API_BASE}/dashboard/resumes/${id}`, { headers: getHeaders() });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Failed to get resume");
    return data;
}

export async function createResume(resumePayload) {
    const res = await fetch(`${API_BASE}/dashboard/resumes`, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify(resumePayload),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Failed to create resume");
    return data;
}

export async function updateResume(id, updates) {
    const res = await fetch(`${API_BASE}/dashboard/resumes/${id}`, {
        method: "PUT",
        headers: getHeaders(),
        body: JSON.stringify(updates),
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

export async function getUsageStats() {
    const res = await fetch(`${API_BASE}/dashboard/stats`, { headers: getHeaders() });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Failed to get stats");
    return data;
}

export async function getAiHistory() {
    const res = await fetch(`${API_BASE}/dashboard/ai-history`, { headers: getHeaders() });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Failed to get AI history");
    return data;
}
