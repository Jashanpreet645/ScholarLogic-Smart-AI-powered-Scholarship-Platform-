import { google } from "@ai-sdk/google";
import { streamText } from "ai";

interface StudentContext {
  fullName: string;
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

export function createAssistantStream(
  messages: { role: "user" | "assistant"; content: string }[],
  studentContext?: StudentContext | null
) {
  const systemPrompt = `You are ScholarLogic AI Assistant — an expert scholarship advisor for Indian students.

${
  studentContext
    ? `STUDENT PROFILE CONTEXT:
- Name: ${studentContext.fullName}
- Education: ${studentContext.educationLevel} - ${studentContext.course} (Year ${studentContext.yearOfStudy})
- GPA: ${studentContext.gpa || "N/A"}
- State: ${studentContext.state}
- Category: ${studentContext.category}
- First Gen Student: ${studentContext.firstGen ? "Yes" : "No"}
- Disability: ${studentContext.disability ? "Yes" : "No"}
- Income: ${studentContext.incomeBracket}`
    : "No student profile loaded yet. Ask them to complete onboarding first."
}

YOUR CAPABILITIES:
1. Answer questions about Indian scholarships (government, private, NGO)
2. Help understand eligibility criteria for specific scholarships
3. Advise on application strategy and timeline management
4. Help draft emails to scholarship offices
5. Explain financial aid terminology
6. Suggest scholarships the student might qualify for

RULES:
- Always be encouraging and supportive
- Give specific, actionable advice
- Reference the student's profile when relevant
- If you don't know something, say so honestly
- Keep responses concise but helpful
- Format responses with markdown for readability`;

  return streamText({
    model: google("gemini-2.0-flash"),
    system: systemPrompt,
    messages: messages.map((m) => ({
      role: m.role as "user" | "assistant",
      content: m.content,
    })),
    temperature: 0.7,
  });
}
