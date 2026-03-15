const { GoogleGenerativeAI } = require("@google/generative-ai");

let genAI = null;
let model = null;

function ensureApiKey() {
    const key = process.env.GEMINI_API_KEY;
    if (!key || key === "your-gemini-api-key-here") {
        throw new Error("GEMINI_API_KEY is not configured. Please add it to your .env file.");
    }
    return key;
}

function getModel() {
    if (!model) {
        const key = ensureApiKey();
        genAI = new GoogleGenerativeAI(key);
        model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
        console.log("[Gemini] Model initialized: gemini-2.0-flash");
    }
    return model;
}

function getVisionModel() {
    const key = ensureApiKey();
    const ai = new GoogleGenerativeAI(key);
    return ai.getGenerativeModel({ model: "gemini-2.0-flash" });
}

// Retry wrapper with exponential backoff for rate-limited requests
async function generateWithRetry(prompt, maxRetries = 3, options = {}) {
    const m = options.model || getModel();

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
        try {
            console.log(`[Gemini] Sending request (attempt ${attempt + 1}/${maxRetries + 1}), prompt length: ${typeof prompt === "string" ? prompt.length : "multipart"} chars`);

            let result;
            if (Array.isArray(prompt)) {
                // Multipart content (text + image)
                result = await m.generateContent(prompt);
            } else {
                result = await m.generateContent(prompt);
            }

            const text = result.response.text();
            console.log(`[Gemini] Response received, length: ${text.length} chars`);
            console.log(`[Gemini] Response preview: ${text.substring(0, 200)}...`);
            return text;
        } catch (err) {
            const isRateLimit = err.status === 429 || err.message?.includes("429");
            const isLastAttempt = attempt === maxRetries;

            if (isRateLimit && !isLastAttempt) {
                let waitMs = Math.min(2000 * Math.pow(2, attempt), 60000);

                const retryMatch = err.message?.match(/retry in (\d+(?:\.\d+)?)s/i);
                if (retryMatch) {
                    waitMs = Math.ceil(parseFloat(retryMatch[1]) * 1000) + 500;
                }

                console.log(`[Gemini] Rate limited. Retrying in ${waitMs}ms (attempt ${attempt + 1}/${maxRetries})...`);
                await new Promise(r => setTimeout(r, waitMs));

                // Reset cached model in case it's stale
                model = null;
                continue;
            }

            console.error(`[Gemini] Error: ${err.message} (status: ${err.status || "unknown"})`);

            // Better error messages for common errors
            if (isRateLimit) {
                throw new Error(
                    "AI rate limit exceeded. Your Gemini API key's free tier quota is exhausted. " +
                    "Please wait a few minutes and try again, or generate a new API key at https://aistudio.google.com/apikey"
                );
            }

            if (err.status === 404) {
                throw new Error("AI model not found. The selected model may have been retired by Google.");
            }

            if (err.status === 403) {
                throw new Error("AI access denied. Please check your Gemini API key is valid.");
            }

            throw err;
        }
    }
}

// Log API key status on load
(function checkApiKeyOnLoad() {
    const key = process.env.GEMINI_API_KEY;
    if (!key) {
        console.warn("[Gemini] ⚠ GEMINI_API_KEY is NOT set in .env");
    } else if (key === "your-gemini-api-key-here") {
        console.warn("[Gemini] ⚠ GEMINI_API_KEY is still the placeholder value");
    } else {
        console.log(`[Gemini] ✓ GEMINI_API_KEY is set (${key.substring(0, 6)}...${key.substring(key.length - 4)})`);
    }
})();

module.exports = { getModel, getVisionModel, generateWithRetry };
