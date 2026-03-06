"use server";

import { extractScholarshipRules } from "@/lib/ai/extractor";
import { createScholarshipFromExtraction } from "@/lib/actions/scholarship.actions";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function processPipelineDocument(formData: FormData) {
  const file = formData.get("file") as File | null;
  if (!file) return { error: "No file provided", success: false };

  // Create a pipeline job record
  const job = await prisma.pipelineJob.create({
    data: {
      fileName: file.name,
      status: "processing",
    },
  });

  const startTime = Date.now();

  try {
    // 1. Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    console.log(
      `[Pipeline] Processing: ${file.name} (${buffer.length} bytes)`
    );

    // 2. Extract rules via Gemini
    const extractedData = await extractScholarshipRules(buffer, file.type);

    const duration = Math.round((Date.now() - startTime) / 1000);

    // 3. Create scholarship in database
    const scholarship = await createScholarshipFromExtraction({
      name: extractedData.scholarshipName,
      provider: extractedData.provider,
      amount: extractedData.amount,
      amountType: extractedData.amountType,
      deadline: extractedData.deadline,
      description: extractedData.description,
      applicationUrl: extractedData.applicationUrl,
      eligibilityRules: extractedData.eligibilityRules,
      requiredDocuments: extractedData.requiredDocuments,
      sourceFile: file.name,
    });

    // 4. Update pipeline job
    await prisma.pipelineJob.update({
      where: { id: job.id },
      data: {
        status: "completed",
        extractedCount: extractedData.eligibilityRules.length,
        duration: `${duration}s`,
        scholarshipId: scholarship.id,
        resultData: extractedData as object,
      },
    });

    revalidatePath("/dashboard/admin");
    revalidatePath("/dashboard/matches");

    return {
      success: true,
      data: extractedData,
      scholarshipId: scholarship.id,
      jobId: job.id,
    };
  } catch (error: unknown) {
    const duration = Math.round((Date.now() - startTime) / 1000);
    const errorMsg =
      error instanceof Error ? error.message : "Failed to process document";

    // Update job as failed
    await prisma.pipelineJob.update({
      where: { id: job.id },
      data: {
        status: "failed",
        error: errorMsg,
        duration: `${duration}s`,
      },
    });

    console.error("[Pipeline] Extraction Error:", error);
    return { error: errorMsg, success: false, jobId: job.id };
  }
}

/**
 * Get all pipeline jobs for the admin dashboard.
 */
export async function getPipelineJobs() {
  return prisma.pipelineJob.findMany({
    orderBy: { createdAt: "desc" },
    take: 50,
  });
}

/**
 * Get pipeline stats.
 */
export async function getPipelineStats() {
  const [total, completed, failed, scholarshipCount] = await Promise.all([
    prisma.pipelineJob.count(),
    prisma.pipelineJob.count({ where: { status: "completed" } }),
    prisma.pipelineJob.count({ where: { status: "failed" } }),
    prisma.scholarship.count({ where: { isActive: true } }),
  ]);

  return {
    totalProcessed: total,
    completed,
    failed,
    successRate: total > 0 ? Math.round((completed / total) * 100 * 10) / 10 : 100,
    scholarshipsInDb: scholarshipCount,
  };
}

