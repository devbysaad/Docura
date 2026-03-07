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

export async function generateResumeAi(description) {
    const res = await fetch(`${API_BASE}/ai/generate`, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify({ description }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "AI generation failed");
    return data;
}

export async function chatWithAi(message, resumeData, history) {
    const res = await fetch(`${API_BASE}/ai/chat`, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify({ message, resumeData, history }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Chat failed");
    return data;
}

export async function reviewResumeAi(file, jobDescription) {
    const formData = new FormData();
    formData.append("resume", file);
    if (jobDescription) formData.append("jobDescription", jobDescription);

    const res = await fetch(`${API_BASE}/ai/review`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: formData,
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Review failed");
    return data;
}

export async function templateFromImageAi(file) {
    const formData = new FormData();
    formData.append("image", file);

    const res = await fetch(`${API_BASE}/ai/template-from-image`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: formData,
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Template analysis failed");
    return data;
}
