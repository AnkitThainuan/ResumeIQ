import dotenv from "dotenv";
dotenv.config();

// ─── Smart fallback analysis (when Gemini API unavailable) ────────────────────
const smartFakeAnalysis = (text, jobRole = "") => {
  const lower = text.toLowerCase();
  const wordCount = text.split(/\s+/).length;

  const detectedSkills = [];
  const skillMap = {
    "react": "React.js", "node": "Node.js", "python": "Python",
    "javascript": "JavaScript", "typescript": "TypeScript", "java": "Java",
    "mongodb": "MongoDB", "sql": "SQL", "aws": "AWS", "docker": "Docker",
    "kubernetes": "Kubernetes", "git": "Git", "css": "CSS", "html": "HTML",
    "express": "Express.js", "django": "Django", "flask": "Flask",
    "next": "Next.js", "vue": "Vue.js", "angular": "Angular",
    "machine learning": "Machine Learning", "tensorflow": "TensorFlow",
    "c++": "C++", "c#": "C#", "php": "PHP", "ruby": "Ruby",
    "figma": "Figma", "redux": "Redux", "graphql": "GraphQL"
  };
  for (const [key, val] of Object.entries(skillMap)) {
    if (lower.includes(key)) detectedSkills.push(val);
  }

  const hasInternship = lower.includes("intern");
  const hasProject = lower.includes("project");
  const hasLinkedIn = lower.includes("linkedin");
  const hasGitHub = lower.includes("github");
  const hasEducation = lower.includes("education") || lower.includes("university") || lower.includes("college") || lower.includes("b.tech") || lower.includes("b.e") || lower.includes("bachelor");
  const hasAchievements = lower.includes("achiev") || lower.includes("award") || lower.includes("winner") || lower.includes("rank");
  const hasCertification = lower.includes("certif");
  const hasMetrics = /\d+%|\d+x|\$\d+|\d+ (users|clients|projects|team)/i.test(text);

  let score = 50;
  if (hasInternship) score += 10;
  if (hasProject) score += 8;
  if (hasGitHub) score += 5;
  if (hasLinkedIn) score += 3;
  if (hasAchievements) score += 7;
  if (hasCertification) score += 5;
  if (hasMetrics) score += 8;
  if (detectedSkills.length > 5) score += 5;
  if (wordCount > 400) score += 4;
  score = Math.min(92, Math.max(42, score));

  const strengths = [];
  if (detectedSkills.length > 0) strengths.push(`Strong technical skills: ${detectedSkills.slice(0, 3).join(", ")}`);
  if (hasProject) strengths.push("Hands-on project experience showcased");
  if (hasInternship) strengths.push("Real-world internship experience included");
  if (hasGitHub) strengths.push("GitHub profile linked — shows active developer");
  if (hasAchievements) strengths.push("Achievements and awards highlighted");
  if (hasCertification) strengths.push("Professional certifications boost credibility");
  if (hasMetrics) strengths.push("Quantified accomplishments with measurable impact");
  if (strengths.length === 0) strengths.push("Resume structure is present", "Contact information included");

  const weaknesses = [];
  if (!hasInternship) weaknesses.push("No internship or work experience mentioned");
  if (!hasMetrics) weaknesses.push("Achievements lack quantifiable metrics (%, numbers, impact)");
  if (!hasGitHub) weaknesses.push("No GitHub/portfolio link found");
  if (!hasCertification) weaknesses.push("No certifications listed");
  if (wordCount < 300) weaknesses.push("Resume appears too short — add more detail");
  if (!hasAchievements) weaknesses.push("No awards or recognitions highlighted");
  if (weaknesses.length === 0) weaknesses.push("Minor formatting inconsistencies possible");

  const allDesirableSkills = ["System Design", "Cloud (AWS/GCP/Azure)", "Docker & Kubernetes", "GraphQL", "TypeScript", "Redis", "CI/CD Pipelines", "DSA & LeetCode", "Next.js", "Testing (Jest/Cypress)"];
  const missingSkills = allDesirableSkills.filter(s => !lower.includes(s.toLowerCase().split(" ")[0])).slice(0, 4);

  const suggestions = [];
  if (!hasMetrics) suggestions.push("Add measurable results: '50% faster load time', '200+ users'");
  if (!hasGitHub) suggestions.push("Add GitHub profile link with active repositories");
  if (!hasLinkedIn) suggestions.push("Include your LinkedIn profile URL");
  if (!hasCertification) suggestions.push("Earn 1-2 relevant certifications (AWS, Google, Meta)");
  if (!hasInternship) suggestions.push("Apply for internships or freelance projects to gain experience");
  suggestions.push("Use strong action verbs: Built, Developed, Led, Optimized");
  if (suggestions.length < 4) suggestions.push("Tailor resume keywords to match job descriptions");

  // Add job role context to fallback
  const roleLabel = jobRole ? ` for ${jobRole} role` : "";
  suggestions.push(`Tailor your resume keywords specifically${roleLabel}`);

  return { score, strengths, weaknesses, missingSkills, suggestions, jobRole };
};

// ─── Main analyze function — now accepts jobRole ──────────────────────────────
export const analyzeResume = async (text, jobRole = "") => {
  try {
    const { GoogleGenerativeAI } = await import("@google/generative-ai");
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // ── Job role context line ──────────────────────────────────────────────────
    const roleContext = jobRole
      ? `The candidate is applying for the role of: ${jobRole}. Analyze the resume specifically for this role — check if skills, experience, and projects align with what a ${jobRole} position typically requires.`
      : `Analyze the resume for general ATS compatibility and common tech roles.`;

    const prompt = `You are an expert ATS resume analyzer. ${roleContext}

Return ONLY a valid JSON object with no markdown, no explanation, no code blocks. Just raw JSON.

{
  "score": <number 0-100 based on ATS compatibility${jobRole ? ` for ${jobRole} role` : ""}>,
  "strengths": [<3-5 specific strengths found in the resume${jobRole ? ` relevant to ${jobRole}` : ""}>],
  "weaknesses": [<3-5 specific weaknesses or gaps${jobRole ? ` for a ${jobRole} position` : ""}>],
  "missingSkills": [<3-5 skills missing${jobRole ? ` that are important for ${jobRole}` : " that are commonly required"}>],
  "suggestions": [<4-6 actionable improvements${jobRole ? ` to better target ${jobRole} roles` : ""}>]
}

Resume text:
${text.substring(0, 3000)}`;

    const result = await model.generateContent(prompt);
    let output = result.response.text().trim();
    output = output.replace(/^```json\s*/i, "").replace(/```\s*$/i, "").trim();
    const parsed = JSON.parse(output);
    console.log(`✅ Gemini AI analysis successful${jobRole ? ` for role: ${jobRole}` : ""}`);
    return { ...parsed, jobRole };

  } catch (error) {
    console.log("⚠️  Gemini AI unavailable → using smart analysis:", error.message);
    return smartFakeAnalysis(text, jobRole);
  }
};