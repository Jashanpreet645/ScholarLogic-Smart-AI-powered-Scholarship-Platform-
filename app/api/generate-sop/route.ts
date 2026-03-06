import { google } from "@ai-sdk/google";
import { generateText } from "ai";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { scholarshipName, scholarshipDetails, promptParams } =
      await req.json();

    if (!scholarshipName) {
      return Response.json(
        { error: "Scholarship name is required" },
        { status: 400 }
      );
    }

    // Get the student's real profile
    const profile = await prisma.studentProfile.findUnique({
      where: { clerkId: userId },
    });

    const profileContext = profile
      ? `- Name: ${profile.fullName}
- Education: ${profile.educationLevel} - ${profile.course} (Year ${profile.yearOfStudy})
- GPA/Percentage: ${profile.gpa || "Not mentioned"}
- State: ${profile.state}
- Category: ${profile.category}
- Gender: ${profile.gender || "Not specified"}
- First Generation College Student: ${profile.firstGen ? "Yes" : "No"}
- Disability Status: ${profile.disability ? "Yes" : "No"}
- Income Bracket: ${profile.incomeBracket}`
      : `- First Generation Learner
- Lower-Middle Class Income Bracket
- Strong Academic Record
- From Tier-2 City`;

    const systemPrompt = `You are an expert scholarship advisor and professional academic writer.
Your goal is to write a highly compelling, personalized Statement of Purpose (SOP) for the student applying to the "${scholarshipName}".

${scholarshipDetails ? `Scholarship Details:\n${scholarshipDetails}\n` : ""}
Student Profile:
${profileContext}

${promptParams ? `Additional Instructions from Student:\n${promptParams}\n` : ""}
GUIDELINES:
1. Write in first person from the student's perspective
2. Structure: Hook → Background/Challenges → Academic Journey → Why This Scholarship → Future Goals → Conclusion
3. Highlight genuine hardships and academic merits naturally
4. Be specific and authentic, avoid generic phrases
5. Clearly explain why they deserve this financial aid
6. Keep it between 500-800 words
7. Make it emotionally compelling while maintaining professionalism

Return ONLY the SOP text, no metadata or formatting instructions.`;

    const { text } = await generateText({
      model: google("gemini-2.0-flash"),
      prompt: systemPrompt,
      temperature: 0.7,
    });

    // Save the SOP draft
    await prisma.sOPDraft.create({
      data: {
        clerkId: userId,
        scholarshipName,
        content: text,
        instructions: promptParams || null,
      },
    });

    return Response.json({ text });
  } catch (error) {
    console.error("SOP generation error:", error);
    return Response.json(
      { error: "Failed to generate SOP" },
      { status: 500 }
    );
  }
}

