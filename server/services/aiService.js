const { getVisionModel, generateWithRetry } = require("../ai/geminiClient");
const { PrismaClient } = require("@prisma/client");
const fs = require("fs");

const prisma = new PrismaClient();

/**
 * Safely parse JSON from AI response, stripping markdown fences.
 */
function safeJsonParse(text, context) {
    const cleaned = text.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
    try {
        return JSON.parse(cleaned);
    } catch (err) {
        console.error(`[AI] JSON parse failed (${context}). Raw text:\n${cleaned.substring(0, 500)}`);
        throw new Error(`AI returned invalid JSON. Raw response preview:\n${text}`);
    }
}

async function generateResumeContent(description, userId, tone = "formal") {
    const toneInstruction = getToneInstruction(tone);

    const prompt = `You are a professional resume writer. Based on the following job description/profile, generate resume content in JSON format.
${toneInstruction}

Description: "${description}"

Return ONLY valid JSON with this exact structure:
{
  "summary": "A professional summary paragraph (3-4 sentences)",
  "skills": ["skill1", "skill2", "skill3", "skill4", "skill5", "skill6", "skill7", "skill8"],
  "experience": [
    {
      "company": "Company Name",
      "role": "Job Title",
      "startDate": "2022-01",
      "endDate": "Present",
      "description": "2-3 sentences describing key achievements and responsibilities"
    }
  ],
  "projects": [
    {
      "name": "Project Name",
      "summary": "Brief project description with technologies used and impact"
    }
  ]
}

Make the content professional, ATS-friendly, and tailored to the description. Include realistic but generic company names. Return ONLY the JSON, no markdown formatting.`;

    console.log(`[AI] generateResumeContent called — desc length: ${description.length}, tone: ${tone}`);
    console.log(`[AI] generateResumeContent prompt sent:\n${prompt.substring(0, 200)}...\n---`);
    const text = await generateWithRetry(prompt);
    console.log(`[AI] generateResumeContent response received, length is ${text.length}`);

    // Save to AI history
    if (userId) {
        await prisma.aiHistory.create({
            data: { userId, type: "generate", prompt: description, response: text },
        });
    }

    return safeJsonParse(text, "generateResumeContent");
}

async function chatWithAssistant(message, resumeData, conversationHistory, userId) {
    const resumeContext = resumeData ? JSON.stringify(resumeData, null, 2) : "No resume data provided.";

    const historyText = conversationHistory
        ? conversationHistory.map(m => `${m.role}: ${m.content}`).join("\n")
        : "";

    const prompt = `You are Docura AI, a professional resume assistant. You help users improve their resumes.

Current resume data:
${resumeContext}

${historyText ? `Previous conversation:\n${historyText}\n` : ""}
User message: "${message}"

Provide helpful, specific, and actionable advice. If the user asks to rewrite something, provide the improved version directly. If suggesting skills, be specific to their field. Keep responses concise but thorough. Use markdown formatting for readability.`;

    console.log(`[AI] chatWithAssistant called — message: "${message.substring(0, 80)}..."`);
    console.log(`[AI] chatWithAssistant prompt sent:\n${prompt.substring(0, 200)}...\n---`);
    const response = await generateWithRetry(prompt);
    console.log(`[AI] chatWithAssistant response received, length is ${response.length}`);

    if (userId) {
        await prisma.aiHistory.create({
            data: { userId, type: "chat", prompt: message, response },
        });
    }

    return response;
}

async function reviewResume(pdfText, jobDescription, userId) {
    const prompt = `You are an expert ATS (Applicant Tracking System) resume reviewer. Analyze the following resume text and provide a detailed review.

Resume Text:
"""
${pdfText}
"""

${jobDescription ? `Target Job Description:\n"""\n${jobDescription}\n"""` : "No specific job description provided."}

Provide your analysis in the following JSON format ONLY (no markdown):
{
  "score": 7,
  "overall": "Brief overall assessment",
  "atsCompatibility": {
    "score": 8,
    "feedback": "ATS compatibility analysis"
  },
  "formatting": {
    "score": 7,
    "feedback": "Formatting analysis"
  },
  "content": {
    "score": 6,
    "feedback": "Content quality analysis"
  },
  "strengths": ["strength1", "strength2", "strength3"],
  "weaknesses": ["weakness1", "weakness2", "weakness3"],
  "missingKeywords": ["keyword1", "keyword2"],
  "suggestions": [
    "Specific suggestion 1",
    "Specific suggestion 2",
    "Specific suggestion 3",
    "Specific suggestion 4",
    "Specific suggestion 5"
  ]
}

Be honest, specific, and constructive. Score out of 10. Return ONLY the JSON.`;

    console.log(`[AI] reviewResume called — text length: ${pdfText.length}, has JD: ${!!jobDescription}`);
    console.log(`[AI] reviewResume prompt sent:\n${prompt.substring(0, 200)}...\n---`);
    const text = await generateWithRetry(prompt);
    console.log(`[AI] reviewResume response received, length is ${text.length}`);

    if (userId) {
        await prisma.aiHistory.create({
            data: { userId, type: "review", prompt: pdfText.substring(0, 500), response: text },
        });
    }

    return safeJsonParse(text, "reviewResume");
}

async function analyzeTemplateImage(imagePath, userId) {
    const visionModel = getVisionModel();

    const imageData = fs.readFileSync(imagePath);
    const base64Image = imageData.toString("base64");
    const mimeType = imagePath.endsWith(".png") ? "image/png" : "image/jpeg";

    const prompt = `Analyze this resume template image and recreate a similar HTML/CSS template. 

Return ONLY valid JSON with this structure:
{
  "templateName": "Name for this template style",
  "description": "Brief description of the layout",
  "html": "<div class='resume-template'>... complete HTML with inline styles that recreates this layout ...</div>",
  "css": ".resume-template { ... complete CSS ... }"
}

The HTML should:
- Use placeholder text like {{fullName}}, {{email}}, {{phone}}, {{summary}}, {{skills}}, {{experience}}, {{education}}
- Match the layout, colors, and typography style of the image
- Be self-contained and printable
- Use modern CSS (flexbox/grid)

Return ONLY the JSON, no markdown.`;

    console.log(`[AI] analyzeTemplateImage called — image: ${imagePath}, mime: ${mimeType}`);
    console.log(`[AI] analyzeTemplateImage prompt sent:\n${prompt.substring(0, 200)}...\n---`);

    // Use generateWithRetry with custom model for retry/error handling
    const text = await generateWithRetry(
        [prompt, { inlineData: { mimeType, data: base64Image } }],
        3,
        { model: visionModel }
    );
    console.log(`[AI] analyzeTemplateImage response received, length is ${text.length}`);

    if (userId) {
        await prisma.aiHistory.create({
            data: { userId, type: "template", prompt: "Template from image", response: text },
        });
    }

    return safeJsonParse(text, "analyzeTemplateImage");
}

async function generateCoverLetter(resumeData, jobDescription, userId, tone = "formal") {
    const toneInstruction = getToneInstruction(tone);

    const prompt = `You are a professional cover letter writer. Based on the resume data and job description below, write a tailored cover letter.
${toneInstruction}

Resume Data:
${JSON.stringify(resumeData, null, 2)}

Job Description:
"""
${jobDescription}
"""

Write a compelling cover letter (3-4 paragraphs) that:
- Opens with a strong hook mentioning the specific role
- Highlights relevant experience and skills from the resume
- Shows knowledge of the company/role from the job description
- Closes with a confident call to action

Return the cover letter as plain text (not JSON). Use professional formatting.`;

    console.log(`[AI] generateCoverLetter called — tone: ${tone}`);
    console.log(`[AI] generateCoverLetter prompt sent:\n${prompt.substring(0, 200)}...\n---`);
    const text = await generateWithRetry(prompt);
    console.log(`[AI] generateCoverLetter response received, length is ${text.length}`);

    if (userId) {
        await prisma.aiHistory.create({
            data: { userId, type: "generate", prompt: "Cover letter generation", response: text },
        });
    }

    return text;
}

async function matchJobDescription(resumeData, jobDescription, userId) {
    const prompt = `You are an expert career coach. Compare the following resume against the job description and identify gaps.

Resume Data:
${JSON.stringify(resumeData, null, 2)}

Job Description:
"""
${jobDescription}
"""

Return ONLY valid JSON:
{
  "matchScore": 75,
  "matchingSkills": ["skill1", "skill2"],
  "missingSkills": ["skill3", "skill4"],
  "missingKeywords": ["keyword1", "keyword2"],
  "suggestions": [
    "Add X to your skills section",
    "Reword Y experience to highlight Z"
  ],
  "strongPoints": ["Your experience in X aligns well", "Your project Y is relevant"],
  "summary": "Brief overall match assessment"
}

Be specific and actionable. Return ONLY the JSON.`;

    console.log(`[AI] matchJobDescription called`);
    console.log(`[AI] matchJobDescription prompt sent:\n${prompt.substring(0, 200)}...\n---`);
    const text = await generateWithRetry(prompt);
    console.log(`[AI] matchJobDescription response received, length is ${text.length}`);

    if (userId) {
        await prisma.aiHistory.create({
            data: { userId, type: "generate", prompt: "JD match", response: text },
        });
    }

    return safeJsonParse(text, "matchJobDescription");
}

async function rewriteBulletPoint(original, tone = "formal", userId) {
    const toneInstruction = getToneInstruction(tone);

    const prompt = `You are a resume writing expert. Rewrite the following experience bullet point to be stronger and more impactful.
${toneInstruction}

Original: "${original}"

Return ONLY valid JSON:
{
  "rewritten": "Improved bullet point starting with a strong action verb, including metrics where possible",
  "alternatives": [
    "Alternative version 1",
    "Alternative version 2"
  ]
}

Focus on: action verbs, quantifiable results, specific impact. Return ONLY the JSON.`;

    console.log(`[AI] rewriteBulletPoint called — original: "${original.substring(0, 60)}..."`);
    console.log(`[AI] rewriteBulletPoint prompt sent:\n${prompt.substring(0, 200)}...\n---`);
    const text = await generateWithRetry(prompt);
    console.log(`[AI] rewriteBulletPoint response received, length is ${text.length}`);

    if (userId) {
        await prisma.aiHistory.create({
            data: { userId, type: "generate", prompt: original, response: text },
        });
    }

    return safeJsonParse(text, "rewriteBulletPoint");
}

async function generateSummary(resumeData, userId, tone = "formal") {
    const toneInstruction = getToneInstruction(tone);

    const prompt = `You are a professional resume writer. Based on the resume data below, generate a professional summary paragraph.
${toneInstruction}

Resume Data:
${JSON.stringify(resumeData, null, 2)}

Return ONLY valid JSON:
{
  "summary": "A compelling 3-4 sentence professional summary that highlights key strengths, experience level, and career focus",
  "alternatives": [
    "Alternative summary version 1",
    "Alternative summary version 2"
  ]
}

Make it ATS-friendly, specific, and compelling. Return ONLY the JSON.`;

    console.log(`[AI] generateSummary called — tone: ${tone}`);
    console.log(`[AI] generateSummary prompt sent:\n${prompt.substring(0, 200)}...\n---`);
    const text = await generateWithRetry(prompt);
    console.log(`[AI] generateSummary response received, length is ${text.length}`);

    if (userId) {
        await prisma.aiHistory.create({
            data: { userId, type: "generate", prompt: "Summary generation", response: text },
        });
    }

    return safeJsonParse(text, "generateSummary");
}

async function atsCheck(resumeData, jobDescription, userId) {
    const prompt = `You are an ATS (Applicant Tracking System) expert. Analyze this resume data for ATS compatibility.

Resume Data:
${JSON.stringify(resumeData, null, 2)}

${jobDescription ? `Target Job Description:\n"""\n${jobDescription}\n"""` : ""}

Return ONLY valid JSON:
{
  "score": 78,
  "issues": [
    {"severity": "high", "message": "Missing standard section: Education"},
    {"severity": "medium", "message": "Skills section has fewer than 8 keywords"},
    {"severity": "low", "message": "Consider adding a professional summary"}
  ],
  "keywordAnalysis": {
    "found": ["keyword1", "keyword2"],
    "missing": ["keyword3", "keyword4"],
    "density": "adequate"
  },
  "formattingIssues": ["Issue 1", "Issue 2"],
  "recommendations": ["Recommendation 1", "Recommendation 2"],
  "sectionCompleteness": {
    "basics": true,
    "summary": false,
    "skills": true,
    "experience": true,
    "education": false,
    "projects": true
  }
}

Be thorough and specific. Return ONLY the JSON.`;

    console.log(`[AI] atsCheck called`);
    console.log(`[AI] atsCheck prompt sent:\n${prompt.substring(0, 200)}...\n---`);
    const text = await generateWithRetry(prompt);
    console.log(`[AI] atsCheck response received, length is ${text.length}`);

    if (userId) {
        await prisma.aiHistory.create({
            data: { userId, type: "review", prompt: "ATS check", response: text },
        });
    }

    return safeJsonParse(text, "atsCheck");
}

/**
 * Returns a tone instruction string for AI prompts.
 */
function getToneInstruction(tone) {
    const tones = {
        formal: "Write in a formal, professional tone.",
        casual: "Write in a friendly, conversational but still professional tone.",
        technical: "Write in a technical, precise tone with industry-specific terminology.",
        executive: "Write in an authoritative, executive-level tone emphasizing leadership and strategic impact.",
    };
    return tones[tone] || tones.formal;
}

module.exports = {
    generateResumeContent,
    chatWithAssistant,
    reviewResume,
    analyzeTemplateImage,
    generateCoverLetter,
    matchJobDescription,
    rewriteBulletPoint,
    generateSummary,
    atsCheck,
};
