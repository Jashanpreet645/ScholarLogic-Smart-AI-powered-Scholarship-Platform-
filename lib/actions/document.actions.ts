"use server";

import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { MAX_FILE_SIZE, ALLOWED_FILE_TYPES } from "@/lib/validators";

/**
 * Upload a document to the secure vault.
 */
export async function uploadDocument(formData: FormData) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const file = formData.get("file") as File | null;
  if (!file) return { error: "No file provided", success: false };

  // Validate file size
  if (file.size > MAX_FILE_SIZE) {
    return { error: "File too large. Maximum size is 5MB.", success: false };
  }

  // Validate file type
  if (!ALLOWED_FILE_TYPES.includes(file.type)) {
    return {
      error: "Invalid file type. Only PDF, JPEG, and PNG are accepted.",
      success: false,
    };
  }

  try {
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const document = await prisma.document.create({
      data: {
        clerkId: userId,
        name: file.name,
        fileType: file.type,
        fileSize: file.size,
        fileData: buffer,
        status: "verified", // Auto-verify for demo
      },
    });

    revalidatePath("/dashboard/vault");
    return { success: true, documentId: document.id };
  } catch (error) {
    console.error("Upload error:", error);
    return { error: "Failed to upload document.", success: false };
  }
}

/**
 * Get all documents for the current user (metadata only, not file data).
 */
export async function getUserDocuments() {
  const { userId } = await auth();
  if (!userId) return [];

  return prisma.document.findMany({
    where: { clerkId: userId },
    select: {
      id: true,
      name: true,
      fileType: true,
      fileSize: true,
      status: true,
      uploadedAt: true,
    },
    orderBy: { uploadedAt: "desc" },
  });
}

/**
 * Download a document (returns file data).
 */
export async function getDocumentData(documentId: string) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const document = await prisma.document.findFirst({
    where: { id: documentId, clerkId: userId },
  });

  if (!document) throw new Error("Document not found");

  // Convert Buffer to base64 for transfer
  const base64 = Buffer.from(document.fileData).toString("base64");
  return {
    name: document.name,
    fileType: document.fileType,
    data: base64,
  };
}

/**
 * Delete a document.
 */
export async function deleteDocument(documentId: string) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  await prisma.document.delete({
    where: { id: documentId, clerkId: userId },
  });

  revalidatePath("/dashboard/vault");
  return { success: true };
}
