import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { MatchesClient } from "./matches-client";
import { passesHardFilters, computeDeterministicScore } from "@/lib/ai/matcher";
import type { EligibilityRule } from "@/lib/types";

export default async function MatchesPage() {
  const { userId } = await auth();

  // Fetch all active scholarships
  const allScholarships = userId
    ? await prisma.scholarship.findMany({
        where: { isActive: true },
        orderBy: { createdAt: "desc" },
      })
    : [];

  // Fetch existing match scores (from previous AI analysis)
  const existingMatches = userId
    ? await prisma.matchScore.findMany({
        where: { clerkId: userId },
        select: { scholarshipId: true, score: true, rationale: true, matchedRules: true },
      })
    : [];

  // Fetch user profile for deterministic scoring
  const profile = userId
    ? await prisma.studentProfile.findUnique({ where: { clerkId: userId } })
    : null;

  // Build a lookup map of existing AI scores
  const matchMap = Object.fromEntries(
    existingMatches.map((m) => [m.scholarshipId, { score: m.score, rationale: m.rationale, matchedRules: m.matchedRules }])
  );

  // Get saved application IDs
  const savedApplications = userId
    ? await prisma.application.findMany({
        where: { clerkId: userId },
        select: { scholarshipId: true, status: true },
      })
    : [];

  const savedMap = Object.fromEntries(
    savedApplications.map((a) => [a.scholarshipId, a.status])
  );

  // Categorize scholarships into eligible / not-eligible using deterministic filters
  const eligible: typeof processedScholarships = [];
  const notEligible: typeof processedScholarships = [];

  type ProcessedScholarship = {
    id: string;
    name: string;
    provider: string;
    description: string | null;
    amount: string;
    amountType: string | null;
    deadline: string | null;
    applicationUrl: string | null;
    requiredDocuments: string[];
    deterministicScore: number;
    failedRules: string[];
    aiScore: number | null;
    aiRationale: string | null;
    aiMatchedRules: unknown[] | null;
    applicationStatus: string | null;
  };

  const processedScholarships: ProcessedScholarship[] = [];

  for (const s of allScholarships) {
    const rules = (s.eligibilityRules as unknown[] || []) as EligibilityRule[];
    const passesHard = profile ? passesHardFilters(
      {
        fullName: profile.fullName,
        gender: profile.gender,
        educationLevel: profile.educationLevel,
        course: profile.course,
        yearOfStudy: profile.yearOfStudy,
        gpa: profile.gpa,
        state: profile.state,
        category: profile.category,
        firstGen: profile.firstGen,
        disability: profile.disability,
        incomeBracket: profile.incomeBracket,
      },
      rules
    ) : true;

    const { score: detScore, failedRules } = profile
      ? computeDeterministicScore(
          {
            fullName: profile.fullName,
            gender: profile.gender,
            educationLevel: profile.educationLevel,
            course: profile.course,
            yearOfStudy: profile.yearOfStudy,
            gpa: profile.gpa,
            state: profile.state,
            category: profile.category,
            firstGen: profile.firstGen,
            disability: profile.disability,
            incomeBracket: profile.incomeBracket,
          },
          rules
        )
      : { score: 0, failedRules: [] };

    const existingAi = matchMap[s.id];

    const processed: ProcessedScholarship = {
      id: s.id,
      name: s.name,
      provider: s.provider,
      description: s.description,
      amount: s.amount,
      amountType: s.amountType,
      deadline: s.deadline?.toISOString() || null,
      applicationUrl: s.applicationUrl,
      requiredDocuments: s.requiredDocuments,
      deterministicScore: passesHard ? detScore : 0,
      failedRules,
      aiScore: existingAi?.score ?? null,
      aiRationale: existingAi?.rationale ?? null,
      aiMatchedRules: (existingAi?.matchedRules as unknown[]) ?? null,
      applicationStatus: savedMap[s.id] || null,
    };

    if (passesHard) {
      eligible.push(processed);
    } else {
      notEligible.push(processed);
    }
  }

  // Sort eligible by AI score (if exists) or deterministic score
  eligible.sort((a, b) => (b.aiScore ?? b.deterministicScore) - (a.aiScore ?? a.deterministicScore));
  notEligible.sort((a, b) => a.name.localeCompare(b.name));

  return (
    <MatchesClient
      eligible={eligible}
      notEligible={notEligible}
      hasProfile={!!profile}
    />
  );
}
