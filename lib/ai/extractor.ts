import { generateObject } from "ai";
import { createGoogleGenerativeAI } from "@ai-sdk/google";

const google = createGoogleGenerativeAI({
  apiKey: process.env.Gemini_API_Key!,
});
import { z } from "zod";

export const scholarshipExtractionSchema = z.object({
  scholarshipName: z.string(),
  provider: z.string(),
  amount: z.string(),
  amountType: z.string().optional(),
  deadline: z.string().nullable(),
  description: z.string().optional(),
  applicationUrl: z.string().optional(),
  eligibilityRules: z.array(
    z.object({
      ruleType: z.enum([
        "gpa",
        "income",
        "location",
        "course",
        "gender",
        "category",
        "education_level",
        "year_of_study",
        "first_gen",
        "disability",
        "other",
      ]),
      operator: z.enum(["gt", "lt", "eq", "contains", "in", "gte", "lte"]),
      value: z.union([z.string(), z.number()]),
      description: z.string(),
      isHardRequirement: z.boolean(),
    })
  ),
  requiredDocuments: z.array(z.string()),
});

export async function extractScholarshipRules(
  fileBuffer: Buffer,
  mimeType: string
) {
  const SYSTEM_PROMPT = `You are an expert scholarship data extractor for ScholarLogic, an Indian scholarship platform.
Analyze the attached document and extract ALL eligibility criteria for the scholarship.

For each eligibility rule, categorize it as one of:
- gpa: Academic performance requirements
- income: Family income thresholds
- location: State/region requirements 
- course: Specific course/major requirements
- gender: Gender-specific scholarships
- category: Caste/reservation category (General, OBC, SC, ST, EWS)
- education_level: Degree level (high_school, undergraduate, postgraduate, phd)
- year_of_study: Specific year requirements
- first_gen: First generation college student requirements
- disability: Disability status requirements
- other: Any other criteria

Use appropriate operators: gt (greater than), lt (less than), eq (equals), contains, in (one of multiple values), gte (>=), lte (<=)

Mark hard requirements (mandatory) vs soft requirements (preferred but not mandatory).
Extract all required documents for the application.
Provide the scholarship amount and type (stipend, one-time, annual, tuition_waiver).`;

  try {
    const { object } = await generateObject({
      model: google("gemini-2.5-flash"),
      schema: scholarshipExtractionSchema,
      messages: [
        {
          role: "user",
          content: [
            { type: "text", text: SYSTEM_PROMPT },
            {
              type: "file",
              data: fileBuffer,
              mediaType: mimeType as
                | "application/pdf"
                | "image/jpeg"
                | "image/png",
            },
          ],
        },
      ],
      temperature: 0.1,
    });

    return object;
  } catch (error) {
    console.error("Failed to extract rules using Gemini:", error);
    throw new Error("AI Extraction Failed: " + (error instanceof Error ? error.message : String(error)));
  }
}

