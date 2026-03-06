"use server";

import { auth, currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

/**
 * Ensures a User row exists in our DB for the current Clerk user.
 * Called from any server action/component that needs a DB user.
 */
export async function ensureUser() {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await currentUser();
  const email =
    user?.emailAddresses[0]?.emailAddress || `${userId}@placeholder.com`;

  const dbUser = await prisma.user.upsert({
    where: { clerkId: userId },
    update: { email },
    create: { clerkId: userId, email },
  });

  return dbUser;
}

/**
 * Get the current user's full profile from DB.
 */
export async function getUserWithProfile() {
  const { userId } = await auth();
  if (!userId) return null;

  const dbUser = await prisma.user.findUnique({
    where: { clerkId: userId },
    include: { profile: true },
  });

  return dbUser;
}

/**
 * Check if the current user has completed onboarding.
 */
export async function hasCompletedOnboarding(): Promise<boolean> {
  const { userId } = await auth();
  if (!userId) return false;

  const profile = await prisma.studentProfile.findUnique({
    where: { clerkId: userId },
  });

  return !!profile;
}
