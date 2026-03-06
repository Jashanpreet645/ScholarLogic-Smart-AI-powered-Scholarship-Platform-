import { google } from "@ai-sdk/google";
import { generateObject } from "ai";
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
function passesHardFilters(
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

// ─── AI Soft Matching via Gemini ─────────────────────────
async function aiSoftMatch(
  profile: StudentProfile,
  scholarship: ScholarshipData
): Promise<{ score: number; rationale: string; matchedRules: unknown[] }> {
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
    // Return a deterministic fallback score
    return {
      score: 50,
      rationale: "AI matching temporarily unavailable. Score based on basic profile alignment.",
      matchedRules: [],
    };
  }
}

// ─── Main Matching Engine ────────────────────────────────
export async function computeMatches(
  profile: StudentProfile,
  scholarships: ScholarshipData[]
): Promise<
  { scholarshipId: string; score: number; rationale: string; matchedRules: unknown[] }[]
> {
  const results: {
    scholarshipId: string;
    score: number;
    rationale: string;
    matchedRules: unknown[];
  }[] = [];

  for (const scholarship of scholarships) {
    const rules = (scholarship.eligibilityRules || []) as EligibilityRule[];

    // Layer 1: Hard deterministic filter
    const passesHard = passesHardFilters(profile, rules);
    if (!passesHard) {
      results.push({
        scholarshipId: scholarship.id,
        score: 0,
        rationale: "Does not meet hard eligibility requirements.",
        matchedRules: [],
      });
      continue;
    }

    // Layer 2: AI soft matching for those that pass hard filters
    const aiResult = await aiSoftMatch(profile, scholarship);
    results.push({
      scholarshipId: scholarship.id,
      score: aiResult.score,
      rationale: aiResult.rationale,
      matchedRules: aiResult.matchedRules,
    });
  }

  // Sort by score descending
  return results.sort((a, b) => b.score - a.score);
}
