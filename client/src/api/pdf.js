const API_BASE = "http://localhost:5000/api/pdf";

/**
 * Send text to the backend and receive a PDF blob.
 * @param {string} text
 * @returns {Promise<Blob>}
 */
export async function generatePdf(text) {
    const response = await fetch(`${API_BASE}/generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
    });

    if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err.error || "Failed to generate PDF");
    }

    return response.blob();
}
