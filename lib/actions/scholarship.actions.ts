"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

/**
 * Get all scholarships (for admin / listings).
 */
export async function getAllScholarships() {
  return prisma.scholarship.findMany({
    where: { isActive: true },
    orderBy: { createdAt: "desc" },
  });
}

/**
 * Get a single scholarship by ID.
 */
export async function getScholarshipById(id: string) {
  return prisma.scholarship.findUnique({ where: { id } });
}

/**
 * Create a scholarship from extracted data.
 */
export async function createScholarshipFromExtraction(data: {
  name: string;
  provider: string;
  amount: string;
  amountType?: string;
  deadline?: string | null;
  description?: string;
  applicationUrl?: string;
  eligibilityRules: unknown[];
  requiredDocuments: string[];
  sourceFile?: string;
}) {
  const scholarship = await prisma.scholarship.create({
    data: {
      name: data.name,
      provider: data.provider,
      description: data.description || null,
      amount: data.amount,
      amountType: data.amountType || null,
      deadline: data.deadline ? new Date(data.deadline) : null,
      applicationUrl: data.applicationUrl || null,
      sourceFile: data.sourceFile || null,
      eligibilityRules: data.eligibilityRules as object,
      requiredDocuments: data.requiredDocuments,
    },
  });

  revalidatePath("/dashboard/admin");
  return scholarship;
}
