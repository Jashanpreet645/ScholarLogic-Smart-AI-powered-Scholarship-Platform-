import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { ApplicationsClient } from "./applications-client";

export default async function ApplicationsTrackerPage() {
  const { userId } = await auth();

  const applications = userId
    ? await prisma.application.findMany({
        where: { clerkId: userId },
        include: { scholarship: true },
        orderBy: { savedAt: "desc" },
      })
    : [];

  const stats = userId
    ? {
        inProgress: await prisma.application.count({
          where: {
            clerkId: userId,
            status: { in: ["SAVED", "APPLIED"] },
          },
        }),
        submitted: await prisma.application.count({
          where: { clerkId: userId, status: "UNDER_REVIEW" },
        }),
        won: await prisma.application.count({
          where: { clerkId: userId, status: "WON" },
        }),
      }
    : { inProgress: 0, submitted: 0, won: 0 };

  return (
    <ApplicationsClient
      applications={applications.map((app) => ({
        id: app.id,
        status: app.status,
        notes: app.notes,
        savedAt: app.savedAt.toISOString(),
        appliedAt: app.appliedAt?.toISOString() || null,
        wonAt: app.wonAt?.toISOString() || null,
        scholarship: {
          id: app.scholarship.id,
          name: app.scholarship.name,
          provider: app.scholarship.provider,
          amount: app.scholarship.amount,
          deadline: app.scholarship.deadline?.toISOString() || null,
        },
      }))}
      stats={stats}
    />
  );
}

