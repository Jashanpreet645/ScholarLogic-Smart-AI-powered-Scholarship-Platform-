"use server";

import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

/**
 * Get chat history for the current user.
 */
export async function getChatHistory() {
  const { userId } = await auth();
  if (!userId) return [];

  return prisma.chatMessage.findMany({
    where: { clerkId: userId },
    orderBy: { createdAt: "asc" },
    take: 50, // Last 50 messages
  });
}

/**
 * Save a chat message pair (user + assistant).
 */
export async function saveChatMessages(
  userMessage: string,
  assistantMessage: string
) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  await prisma.chatMessage.createMany({
    data: [
      { clerkId: userId, role: "user", content: userMessage },
      { clerkId: userId, role: "assistant", content: assistantMessage },
    ],
  });
}

/**
 * Clear chat history.
 */
export async function clearChatHistory() {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  await prisma.chatMessage.deleteMany({
    where: { clerkId: userId },
  });

  return { success: true };
}
