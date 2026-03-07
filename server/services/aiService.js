const { getModel, getVisionModel, generateWithRetry } = require("../ai/geminiClient");
const { PrismaClient } = require("@prisma/client");
const fs = require("fs");

const prisma = new PrismaClient();

async function generateResumeContent(description, userId) {
  const prompt = `You are a professional resume writer. Based on the following job description/profile, generate resume content in JSON format.

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

  const text = await generateWithRetry(prompt);

  // Save to AI history
  if (userId) {
    await prisma.aiHistory.create({
      data: { userId, type: "generate", prompt: description, response: text },
    });
  }

  // Parse JSON from response
  const cleaned = text.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
  return JSON.parse(cleaned);
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

  const response = await generateWithRetry(prompt);

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

  const text = await generateWithRetry(prompt);

  if (userId) {
    await prisma.aiHistory.create({
      data: { userId, type: "review", prompt: pdfText.substring(0, 500), response: text },
    });
  }

  const cleaned = text.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
  return JSON.parse(cleaned);
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

  const result = await visionModel.generateContent([
    prompt,
    { inlineData: { mimeType, data: base64Image } },
  ]);

  const text = result.response.text();

  if (userId) {
    await prisma.aiHistory.create({
      data: { userId, type: "template", prompt: "Template from image", response: text },
    });
  }

  const cleaned = text.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
  return JSON.parse(cleaned);
}

module.exports = { generateResumeContent, chatWithAssistant, reviewResume, analyzeTemplateImage };
