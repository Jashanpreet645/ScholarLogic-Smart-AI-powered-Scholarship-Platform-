import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { generateObject } from "ai";

const google = createGoogleGenerativeAI({
  apiKey: process.env.Gemini_API_Key!,
});
import { z } from "zod";
import type { EligibilityRule } from "@/lib/types";

interface StudentProfile {
  fullName: string;
  gender?: string | null;
  educationLevel: string;
  course: string;
  yearOfStudy: string;
  gpa?: string | null;
  state: string;
  category: string;
  firstGen: boolean;
  disability: boolean;
  incomeBracket: string;
}

interface ScholarshipData {
  id: string;
  name: string;
  provider: string;
  amount: string;
  eligibilityRules: EligibilityRule[];
}

const matchResultSchema = z.object({
  score: z.number().min(0).max(100),
  rationale: z.string(),
  matchedRules: z.array(
    z.object({
      rule: z.string(),
      met: z.boolean(),
      reason: z.string(),
    })
  ),
});

// ─── Hard Deterministic Filter ───────────────────────────
// Returns false if student DEFINITELY does not qualify
export function passesHardFilters(
  profile: StudentProfile,
  rules: EligibilityRule[]
): boolean {
  for (const rule of rules) {
    if (!rule.isHardRequirement) continue;

    switch (rule.ruleType) {
      case "education_level":
        if (
          rule.operator === "eq" &&
          profile.educationLevel.toLowerCase() !== String(rule.value).toLowerCase()
        )
          return false;
        if (
          rule.operator === "in" &&
          !String(rule.value)
            .toLowerCase()
            .split(",")
            .map((v) => v.trim())
            .includes(profile.educationLevel.toLowerCase())
        )
          return false;
        break;

      case "gender":
        if (
          rule.operator === "eq" &&
          profile.gender &&
          profile.gender.toLowerCase() !== String(rule.value).toLowerCase()
        )
          return false;
        break;

      case "category":
        if (
          rule.operator === "eq" &&
          profile.category.toLowerCase() !== String(rule.value).toLowerCase()
        )
          return false;
        if (
          rule.operator === "in" &&
          !String(rule.value)
            .toLowerCase()
            .split(",")
            .map((v) => v.trim())
            .includes(profile.category.toLowerCase())
        )
          return false;
        break;

      case "location":
        if (
          rule.operator === "eq" &&
          profile.state.toLowerCase() !== String(rule.value).toLowerCase()
        )
          return false;
        if (
          rule.operator === "in" &&
          !String(rule.value)
            .toLowerCase()
            .split(",")
            .map((v) => v.trim())
            .includes(profile.state.toLowerCase())
        )
          return false;
        break;

      case "income": {
        const incomeMap: Record<string, number> = {
          below_1l: 50000,
          "1l_to_2.5l": 175000,
          "2.5l_to_5l": 375000,
          "5l_to_8l": 650000,
          above_8l: 1000000,
        };
        const studentIncome = incomeMap[profile.incomeBracket] || 500000;
        const threshold = Number(rule.value);
        if (rule.operator === "lt" && studentIncome >= threshold) return false;
        if (rule.operator === "lte" && studentIncome > threshold) return false;
        if (rule.operator === "gt" && studentIncome <= threshold) return false;
        break;
      }

      case "gpa": {
        const studentGpa = parseFloat(profile.gpa || "0");
        const threshold = Number(rule.value);
        if (rule.operator === "gt" && studentGpa <= threshold) return false;
        if (rule.operator === "gte" && studentGpa < threshold) return false;
        break;
      }
    }
  }
  return true;
}

// ─── Deterministic Score (no AI) ─────────────────────────
// Quick score based on how many rules the student matches
export function computeDeterministicScore(
  profile: StudentProfile,
  rules: EligibilityRule[]
): { score: number; failedRules: string[] } {
  if (rules.length === 0) return { score: 60, failedRules: [] };

  const failedRules: string[] = [];
  let matchedCount = 0;

  for (const rule of rules) {
    let passes = true;

    switch (rule.ruleType) {
      case "education_level":
        if (rule.operator === "eq" && profile.educationLevel.toLowerCase() !== String(rule.value).toLowerCase()) passes = false;
        if (rule.operator === "in" && !String(rule.value).toLowerCase().split(",").map(v => v.trim()).includes(profile.educationLevel.toLowerCase())) passes = false;
        break;
      case "gender":
        if (rule.operator === "eq" && profile.gender && profile.gender.toLowerCase() !== String(rule.value).toLowerCase()) passes = false;
        break;
      case "category":
        if (rule.operator === "eq" && profile.category.toLowerCase() !== String(rule.value).toLowerCase()) passes = false;
        if (rule.operator === "in" && !String(rule.value).toLowerCase().split(",").map(v => v.trim()).includes(profile.category.toLowerCase())) passes = false;
        break;
      case "location":
        if (rule.operator === "eq" && profile.state.toLowerCase() !== String(rule.value).toLowerCase()) passes = false;
        if (rule.operator === "in" && !String(rule.value).toLowerCase().split(",").map(v => v.trim()).includes(profile.state.toLowerCase())) passes = false;
        break;
      case "income": {
        const incomeMap: Record<string, number> = { below_1l: 50000, "1l_to_2.5l": 175000, "2.5l_to_5l": 375000, "5l_to_8l": 650000, above_8l: 1000000 };
        const studentIncome = incomeMap[profile.incomeBracket] || 500000;
        const threshold = Number(rule.value);
        if (rule.operator === "lt" && studentIncome >= threshold) passes = false;
        if (rule.operator === "lte" && studentIncome > threshold) passes = false;
        if (rule.operator === "gt" && studentIncome <= threshold) passes = false;
        break;
      }
      case "gpa": {
        const studentGpa = parseFloat(profile.gpa || "0");
        const threshold = Number(rule.value);
        if (rule.operator === "gt" && studentGpa <= threshold) passes = false;
        if (rule.operator === "gte" && studentGpa < threshold) passes = false;
        break;
      }
    }

    if (passes) {
      matchedCount++;
    } else {
      failedRules.push(rule.description || `${rule.ruleType} ${rule.operator} ${rule.value}`);
    }
  }

  const score = Math.round((matchedCount / rules.length) * 100);
  return { score, failedRules };
}

// ─── AI Soft Matching via Gemini (single scholarship) ────
export async function analyzeScholarshipMatch(
  profile: StudentProfile,
  scholarship: ScholarshipData
): Promise<{ score: number; rationale: string; matchedRules: { rule: string; met: boolean; reason: string }[] }> {
  try {
    const { object } = await generateObject({
      model: google("gemini-2.0-flash"),
      schema: matchResultSchema,
      prompt: `You are a scholarship eligibility analyzer for Indian students.

STUDENT PROFILE:
- Name: ${profile.fullName}
- Education: ${profile.educationLevel} - ${profile.course} (Year ${profile.yearOfStudy})
- GPA/Percentage: ${profile.gpa || "Not provided"}
- State: ${profile.state}
- Category: ${profile.category}
- Gender: ${profile.gender || "Not specified"}
- First Generation Student: ${profile.firstGen ? "Yes" : "No"}
- Disability Status: ${profile.disability ? "Yes" : "No"}  
- Income Bracket: ${profile.incomeBracket}

SCHOLARSHIP: ${scholarship.name} by ${scholarship.provider}
Amount: ${scholarship.amount}
Eligibility Rules: ${JSON.stringify(scholarship.eligibilityRules)}

Analyze how well this student matches this scholarship. Consider both hard requirements and soft demographic signals. Return a match score (0-100) and clear rationale.`,
      temperature: 0.1,
    });

    return {
      score: object.score,
      rationale: object.rationale,
      matchedRules: object.matchedRules,
    };
  } catch (error) {
    console.error(`AI matching failed for scholarship ${scholarship.name}:`, error);
    return {
      score: 50,
      rationale: "AI matching temporarily unavailable. Score based on basic profile alignment.",
      matchedRules: [],
    };
  }
}

// ─── Main Matching Engine (Deterministic by Default) ─────────
export async function computeMatches(
  profile: StudentProfile,
  scholarships: ScholarshipData[]
): Promise<
  { scholarshipId: string; score: number; rationale: string; matchedRules: unknown[] }[]
> {
  // Run deterministic matches for all active scholarships
  const results = scholarships.map((scholarship) => {
    const rules = (scholarship.eligibilityRules || []) as EligibilityRule[];

    // Layer 1: Hard deterministic filter
    const passesHard = passesHardFilters(profile, rules);
    if (!passesHard) {
      return {
        scholarshipId: scholarship.id,
        score: 0,
        rationale: "Does not meet hard eligibility requirements.",
        matchedRules: [],
      };
    }

    // Layer 2: Deterministic scoring (No Gemini tokens consumed here)
    const detResult = computeDeterministicScore(profile, rules);
    return {
      scholarshipId: scholarship.id,
      score: detResult.score,
      rationale: "[PENDING_NEURAL_ANALYSIS] Deterministic match based on profile rules. Run Neural AI for detailed insights.",
      matchedRules: detResult.failedRules.map(rule => ({
        rule,
        met: false,
        reason: "Does not meet baseline profile requirement."
      })),
    };
  });

  // Sort by score descending
  return results.sort((a, b) => b.score - a.score);
}
