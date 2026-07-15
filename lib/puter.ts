import { type DecodedResult } from "@/app/mockDecoder";

let puterInstance: any = null;

/**
 * Safely imports and returns the Puter.js client.
 * This function guarantees browser-only loading to prevent SSR build issues in Next.js.
 */
export async function getPuter() {
  if (typeof window === "undefined") return null;
  if (!puterInstance) {
    try {
      const module = await import("@heyputer/puter.js");
      puterInstance = module.default || module;
    } catch (err) {
      console.error("Failed to dynamically import @heyputer/puter.js:", err);
      return null;
    }
  }
  return puterInstance;
}

/**
 * Calls Puter's AI to decode a raw job description using system instructions and schema specifications.
 */
export async function decodeJobDescriptionWithAI(text: string): Promise<DecodedResult> {
  const puter = await getPuter();
  if (!puter) {
    throw new Error("Puter client could not be loaded on the client side.");
  }

  const prompt = `You are an expert technical recruiter, engineering manager, and career coach. Your task is to analyze the following Job Description (JD) and extract key requirements, red flags, and prep roadmap into a JSON object matching this TypeScript interface:

interface DecodedResult {
  roleTitle: string; // The specific title of the role (e.g. Senior Frontend Engineer)
  seniority: "Junior" | "Mid-Level" | "Senior" | "Lead" | "Staff / Principal";
  seniorityReason: string; // Detailed analysis of why this seniority level is assessed (e.g., years of experience requested, leadership expectations, level of autonomy).
  confidence: number; // 0 to 100 percentage match confidence based on JD clarity
  summary: string; // Concise professional summary of what the role actually entails
  translatedSummary: string; // The "Behind the Scenes" candid, slightly humorous, brutally honest explanation of what the company actually expects or what their corporate jargon really translates to (be realistic, funny, and direct).
  mustHaves: string[]; // 3-5 core mandatory skills or requirements
  niceToHaves: string[]; // 3-5 bonus/preferred qualifications
  redFlags: {
    flag: string; // Title of the red flag (e.g. "Rockstar developer wanted")
    description: string; // Why this is a concern or what it reveals about company culture
    severity: "low" | "medium" | "high";
  }[];
  studyChecklist: {
    id: string; // unique ID like "topic-1", "topic-2"
    topic: string; // specific study topic or project idea based on the must-haves
    completed: boolean; // default false
  }[];
}

Instructions:
1. Return ONLY valid raw JSON.
2. Do NOT wrap the JSON inside markdown code blocks (e.g., \`\`\`json).
3. Do NOT output any introductory text, prefix, suffix, or explanation.
4. If you mention tools/technologies in Must-Haves, make sure to add specific study checklist items matching them.

Job Description:
${text}`;

  // We request puter.ai.chat to generate the content. 
  // We use claude-3-5-sonnet with its provider prefix for best-in-class structural JSON reasoning.
  let response;
  try {
    response = await puter.ai.chat(prompt, {
      model: "anthropic/claude-3-5-sonnet",
    });
  } catch (err) {
    console.warn("anthropic/claude-3-5-sonnet not found or failed, falling back to default Puter AI model:", err);
    response = await puter.ai.chat(prompt);
  }

  if (!response || !response.message || !response.message.content) {
    throw new Error("Empty response received from Puter AI.");
  }

  let content = response.message.content.trim();

  // Strip code blocks if the AI returned them despite instructions
  if (content.startsWith("```")) {
    const lines = content.split("\n");
    if (lines[0].startsWith("```")) {
      lines.shift();
    }
    if (lines[lines.length - 1].startsWith("```")) {
      lines.pop();
    }
    content = lines.join("\n").trim();
  }

  // Extract content between first '{' and last '}' to make parsing resilient
  const startIdx = content.indexOf("{");
  const endIdx = content.lastIndexOf("}");
  if (startIdx !== -1 && endIdx !== -1) {
    content = content.substring(startIdx, endIdx + 1);
  }

  try {
    const parsed = JSON.parse(content) as DecodedResult;

    // Apply defaults and validation
    return {
      roleTitle: parsed.roleTitle || "Software Engineer",
      seniority: parsed.seniority || "Mid-Level",
      seniorityReason: parsed.seniorityReason || "Standard professional experience requested.",
      confidence: typeof parsed.confidence === "number" ? parsed.confidence : 80,
      summary: parsed.summary || "General software developer position.",
      translatedSummary: parsed.translatedSummary || "They need standard engineering work done.",
      mustHaves: Array.isArray(parsed.mustHaves) ? parsed.mustHaves : [],
      niceToHaves: Array.isArray(parsed.niceToHaves) ? parsed.niceToHaves : [],
      redFlags: Array.isArray(parsed.redFlags) ? parsed.redFlags : [],
      studyChecklist: Array.isArray(parsed.studyChecklist)
        ? parsed.studyChecklist.map((item: any, i: number) => ({
            id: item.id || `topic-${i + 1}`,
            topic: item.topic || String(item),
            completed: typeof item.completed === "boolean" ? item.completed : false,
          }))
        : [],
    };
  } catch (err) {
    console.error("Error parsing Puter AI JSON:", content, err);
    throw new Error("The AI returned invalid JSON. Please try parsing the JD again.");
  }
}
