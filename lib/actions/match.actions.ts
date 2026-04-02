"use server";

import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { computeMatches, analyzeScholarshipMatch } from "@/lib/ai/matcher";
import { revalidatePath } from "next/cache";
import type { EligibilityRule } from "@/lib/types";

/**
 * Run the matching engine for the current user against all active scholarships.
 * Creates/updates MatchScore records in the database.
 */
export async function runMatchingEngine() {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  // Get profile
  const profile = await prisma.studentProfile.findUnique({
    where: { clerkId: userId },
  });
  if (!profile) throw new Error("Complete your profile first");

  // Get all active scholarships
  const scholarships = await prisma.scholarship.findMany({
    where: { isActive: true },
    select: {
      id: true,
      name: true,
      provider: true,
      amount: true,
      eligibilityRules: true,
    },
  });

  if (scholarships.length === 0) return { matched: 0 };

  // Compute matches
  const results = await computeMatches(
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
    scholarships.map((s) => ({
      id: s.id,
      name: s.name,
      provider: s.provider,
      amount: s.amount,
      eligibilityRules: (s.eligibilityRules as unknown[]) as EligibilityRule[],
    }))
  );

  // Upsert match scores (only those with score > 0)
  let matchedCount = 0;
  for (const result of results) {
    if (result.score > 0) {
      await prisma.matchScore.upsert({
        where: {
          clerkId_scholarshipId: {
            clerkId: userId,
            scholarshipId: result.scholarshipId,
          },
        },
        update: {
          score: result.score,
          rationale: result.rationale,
          matchedRules: result.matchedRules as object[],
        },
        create: {
          clerkId: userId,
          scholarshipId: result.scholarshipId,
          score: result.score,
          rationale: result.rationale,
          matchedRules: result.matchedRules as object[],
        },
      });
      matchedCount++;
    }
  }

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/matches");

  return { matched: matchedCount };
}

/**
 * Analyze a single scholarship match on-demand (triggered by user clicking "Analyze with AI").
 * This saves API quota by only calling Gemini when the user explicitly requests it.
 */
export async function analyzeScholarship(scholarshipId: string) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const profile = await prisma.studentProfile.findUnique({
    where: { clerkId: userId },
  });
  if (!profile) throw new Error("Complete your profile first");

  const scholarship = await prisma.scholarship.findUnique({
    where: { id: scholarshipId },
    select: {
      id: true,
      name: true,
      provider: true,
      amount: true,
      eligibilityRules: true,
    },
  });
  if (!scholarship) throw new Error("Scholarship not found");

  const result = await analyzeScholarshipMatch(
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
    {
      id: scholarship.id,
      name: scholarship.name,
      provider: scholarship.provider,
      amount: scholarship.amount,
      eligibilityRules: (scholarship.eligibilityRules as unknown[]) as EligibilityRule[],
    }
  );

  // Save the result to the database for future visits
  await prisma.matchScore.upsert({
    where: {
      clerkId_scholarshipId: {
        clerkId: userId,
        scholarshipId: scholarship.id,
      },
    },
    update: {
      score: result.score,
      rationale: result.rationale,
      matchedRules: result.matchedRules as object[],
    },
    create: {
      clerkId: userId,
      scholarshipId: scholarship.id,
      score: result.score,
      rationale: result.rationale,
      matchedRules: result.matchedRules as object[],
    },
  });

  revalidatePath("/dashboard/matches");

  return {
    score: result.score,
    rationale: result.rationale,
    matchedRules: result.matchedRules,
  };
}

/**
 * Get all matches for the current user, sorted by score descending.
 */
export async function getUserMatches() {
  const { userId } = await auth();
  if (!userId) return [];

  const matches = await prisma.matchScore.findMany({
    where: { clerkId: userId, score: { gt: 0 } },
    include: { scholarship: true },
    orderBy: { score: "desc" },
  });

  return matches;
}
