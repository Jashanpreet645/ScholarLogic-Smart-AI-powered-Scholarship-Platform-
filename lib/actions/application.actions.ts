"use server";

import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import type { ApplicationStatus } from "@prisma/client";

/**
 * Toggle save (create or delete) for a scholarship.
 */
export async function toggleSaveApplication(scholarshipId: string) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const existing = await prisma.application.findUnique({
    where: {
      clerkId_scholarshipId: {
        clerkId: userId,
        scholarshipId,
      },
    },
  });

  if (existing) {
    await prisma.application.delete({
      where: { id: existing.id },
    });
  } else {
    await prisma.application.create({
      data: {
        clerkId: userId,
        scholarshipId,
        status: "SAVED",
      },
    });
  }

  revalidatePath("/dashboard/applications");
  revalidatePath("/dashboard/matches");
  revalidatePath("/dashboard");
  
  return { saved: !existing };
}

/**
 * Save or create an application for a scholarship.
 */
export async function saveApplication(scholarshipId: string) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const application = await prisma.application.upsert({
    where: {
      clerkId_scholarshipId: {
        clerkId: userId,
        scholarshipId,
      },
    },
    update: {},
    create: {
      clerkId: userId,
      scholarshipId,
      status: "SAVED",
    },
  });

  revalidatePath("/dashboard/applications");
  revalidatePath("/dashboard/matches");
  return application;
}

/**
 * Update application status.
 */
export async function updateApplicationStatus(
  applicationId: string,
  status: ApplicationStatus,
  notes?: string
) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const updateData: {
    status: ApplicationStatus;
    notes?: string;
    appliedAt?: Date;
    wonAt?: Date;
  } = { status };

  if (notes) updateData.notes = notes;
  if (status === "APPLIED") updateData.appliedAt = new Date();
  if (status === "WON") updateData.wonAt = new Date();

  const application = await prisma.application.update({
    where: { id: applicationId, clerkId: userId },
    data: updateData,
  });

  revalidatePath("/dashboard/applications");
  revalidatePath("/dashboard");
  return application;
}

/**
 * Get all applications for the current user with scholarship details.
 */
export async function getUserApplications() {
  const { userId } = await auth();
  if (!userId) return [];

  return prisma.application.findMany({
    where: { clerkId: userId },
    include: { scholarship: true },
    orderBy: { savedAt: "desc" },
  });
}

/**
 * Delete a saved application.
 */
export async function deleteApplication(applicationId: string) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  await prisma.application.delete({
    where: { id: applicationId, clerkId: userId },
  });

  revalidatePath("/dashboard/applications");
  revalidatePath("/dashboard");
}
