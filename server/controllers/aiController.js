import { GoogleGenerativeAI } from "@google/generative-ai";
import { Category } from "../models/Category.js";
import { Portal } from "../models/Portal.js";

const MODEL_NAME = process.env.GEMINI_MODEL || "gemini-2.5-flash";

const SYSTEM_PROMPT = `
You are a grievance portal assistant for India.

You must ALWAYS respond in strict JSON with this structure and nothing else:
{
  "categoryName": string,                   // one of: "Municipal", "Electrical", "Transport & Infrastructure", "Water Supply & Sanitation", "Health & Medical Services", "Education", or another category name used in the system
  "level": "national" | "state" | "local",
  "state": string | null,
  "city": string | null,
  "reason": string,
  "steps": string[],
  "keywords": string[]
}

Rules:
- Choose level and category that best match the user's grievance.
- If user location is given or implied, prefer local/state portals; otherwise national.
- Steps should be concrete, user-facing instructions to raise the complaint on the portal type you recommend.
- Respond with JSON only, no extra text.
`;

export const analyzeQuery = async (req, res) => {
  try {
    const { query, state, city } = req.body || {};

    if (!query || !query.trim()) {
      return res.status(400).json({ message: "query is required" });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ message: "GEMINI_API_KEY is not configured" });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: MODEL_NAME });

    const composedPrompt = [
      SYSTEM_PROMPT,
      "",
      `User query: ${query}`,
      state ? `User state: ${state}` : "",
      city ? `User city: ${city}` : "",
    ]
      .filter(Boolean)
      .join("\n");

    const result = await model.generateContent(composedPrompt);
    const raw = result.response.text().trim();

    let parsed;
    try {
      // Strip out markdown code blocks if the model wraps the response
      const cleanRaw = raw.replace(/^```json\s*/i, '').replace(/```\s*$/i, '').trim();
      parsed = JSON.parse(cleanRaw);
    } catch {
      return res.status(502).json({ message: "Failed to parse AI response", raw });
    }

    const {
      categoryName = "",
      level,
      state: aiState,
      city: aiCity,
      reason = "",
      steps = [],
    } = parsed;

    // Find category by name if possible
    let categoryDoc = null;
    if (categoryName) {
      // eslint-disable-next-line no-await-in-loop
      categoryDoc = await Category.findOne({ name: categoryName });
    }

    const portalQuery = {
      level,
    };

    if (categoryDoc) {
      // @ts-ignore - plain JS at runtime
      portalQuery.category = categoryDoc._id;
    }

    if (aiState) {
      // @ts-ignore
      portalQuery.state = aiState;
    }
    if (aiCity && level === "local") {
      // @ts-ignore
      portalQuery.city = aiCity;
    }

    let portal = await Portal.findOne(portalQuery).sort({ avgRating: -1, totalReviews: -1 });

    // Fallback: ignore state/city if nothing found
    if (!portal) {
      // @ts-ignore
      delete portalQuery.state;
      // @ts-ignore
      delete portalQuery.city;
      portal = await Portal.findOne(portalQuery).sort({ avgRating: -1, totalReviews: -1 });
    }

    return res.json({
      query,
      categoryName,
      level,
      state: aiState || null,
      city: aiCity || null,
      reason,
      steps,
      portal,
    });
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error("Error in analyzeQuery:", err);
    return res.status(500).json({ message: "Failed to analyze query" });
  }
};

export const generateComplaint = async (req, res) => {
  try {
    const { query, portalName, category, level, state, city, reason } = req.body || {};

    if (!query || !query.trim()) {
      return res.status(400).json({ message: "query is required" });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ message: "GEMINI_API_KEY is not configured" });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: MODEL_NAME });

    const prompt = [
      `You are an expert in writing formal government complaint letters in India.`,
      ``,
      `Write a professional, formal complaint letter in English based on the user's grievance below.`,
      `Format it as a proper letter ready to submit. Include:`,
      `- A subject line`,
      `- Salutation (addressed to the appropriate authority based on the portal/level)`,
      `- A clear description of the issue`,
      `- A polite but firm request for resolution`,
      `- A closing`,
      ``,
      `Leave [Your Name], [Your Address], [Date], [Contact Number] as placeholders for the user to fill in.`,
      `Output plain text only — no markdown formatting.`,
      ``,
      `User's grievance: ${query}`,
      portalName ? `Portal: ${portalName}` : "",
      category ? `Category: ${category}` : "",
      level ? `Level: ${level}` : "",
      state ? `State: ${state}` : "",
      city ? `City: ${city}` : "",
      reason ? `Context/Reason: ${reason}` : "",
    ]
      .filter(Boolean)
      .join("\n");

    const result = await model.generateContent(prompt);
    const complaint = result.response.text().trim();

    return res.json({ complaint });
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error("Error in generateComplaint:", err);
    return res.status(500).json({ message: "Failed to generate complaint" });
  }
};
