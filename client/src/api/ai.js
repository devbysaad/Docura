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

export async function generateResumeAi(description, tone) {
    const res = await fetch(`${API_BASE}/ai/generate`, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify({ description, tone }),
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

export async function generateCoverLetterAi(resumeData, jobDescription, tone) {
    const res = await fetch(`${API_BASE}/ai/cover-letter`, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify({ resumeData, jobDescription, tone }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Cover letter generation failed");
    return data;
}

export async function matchJobAi(resumeData, jobDescription) {
    const res = await fetch(`${API_BASE}/ai/match-job`, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify({ resumeData, jobDescription }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Job matching failed");
    return data;
}

export async function rewriteBulletAi(text, tone) {
    const res = await fetch(`${API_BASE}/ai/rewrite-bullet`, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify({ text, tone }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Rewrite failed");
    return data;
}

export async function generateSummaryAi(resumeData, tone) {
    const res = await fetch(`${API_BASE}/ai/summary`, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify({ resumeData, tone }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Summary generation failed");
    return data;
}

export async function atsCheckAi(resumeData, jobDescription) {
    const res = await fetch(`${API_BASE}/ai/ats-check`, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify({ resumeData, jobDescription }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "ATS check failed");
    return data;
}
