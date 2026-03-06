"use server";

import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

/**
 * Save a generated SOP draft.
 */
export async function saveSopDraft(
  scholarshipName: string,
  content: string,
  instructions?: string
) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const draft = await prisma.sOPDraft.create({
    data: {
      clerkId: userId,
      scholarshipName,
      content,
      instructions,
    },
  });

  return draft;
}

/**
 * Get all SOP drafts for the current user.
 */
export async function getSopDrafts() {
  const { userId } = await auth();
  if (!userId) return [];

  return prisma.sOPDraft.findMany({
    where: { clerkId: userId },
    orderBy: { createdAt: "desc" },
  });
}

/**
 * Delete an SOP draft.
 */
export async function deleteSopDraft(draftId: string) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  await prisma.sOPDraft.delete({
    where: { id: draftId, clerkId: userId },
  });

  revalidatePath("/dashboard/sop");
  return { success: true };
}
