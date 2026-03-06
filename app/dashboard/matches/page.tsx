import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { MatchesClient } from "./matches-client";

export default async function MatchesPage() {
  const { userId } = await auth();

  const matches = userId
    ? await prisma.matchScore.findMany({
        where: { clerkId: userId, score: { gt: 0 } },
        include: { scholarship: true },
        orderBy: { score: "desc" },
      })
    : [];

  // Get saved application IDs to mark which ones are already saved
  const savedApplications = userId
    ? await prisma.application.findMany({
        where: { clerkId: userId },
        select: { scholarshipId: true, status: true },
      })
    : [];

  const savedMap = Object.fromEntries(
    savedApplications.map((a) => [a.scholarshipId, a.status])
  );

  return (
    <MatchesClient
      matches={matches.map((m) => ({
        id: m.id,
        score: m.score,
        rationale: m.rationale,
        scholarship: {
          id: m.scholarship.id,
          name: m.scholarship.name,
          provider: m.scholarship.provider,
          amount: m.scholarship.amount,
          amountType: m.scholarship.amountType,
          deadline: m.scholarship.deadline?.toISOString() || null,
          applicationUrl: m.scholarship.applicationUrl,
          requiredDocuments: m.scholarship.requiredDocuments,
        },
        applicationStatus: savedMap[m.scholarshipId] || null,
      }))}
    />
  );
}

