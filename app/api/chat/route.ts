import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { createAssistantStream } from "@/lib/ai/assistant";

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return new Response("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const messages = body.messages ?? [];

    if (!Array.isArray(messages) || messages.length === 0) {
      return new Response("Messages are required", { status: 400 });
    }

    // Get student profile for context
    const profile = await prisma.studentProfile.findUnique({
      where: { clerkId: userId },
    });

    // Extract plain text messages for the AI
    const chatMessages = messages.map(
      (m: { role: string; content?: string; parts?: { type: string; text?: string }[] }) => ({
        role: m.role as "user" | "assistant",
        content:
          m.content ||
          m.parts
            ?.filter((p) => p.type === "text")
            .map((p) => p.text)
            .join("") ||
          "",
      })
    );

    // Create the streaming response
    const result = createAssistantStream(chatMessages, profile);

    // Save user message to chat history (non-blocking)
    const lastUserMsg = chatMessages[chatMessages.length - 1];
    if (lastUserMsg?.role === "user") {
      prisma.chatMessage
        .create({
          data: {
            clerkId: userId,
            role: "user",
            content: lastUserMsg.content,
          },
        })
        .catch(console.error);
    }

    return result.toUIMessageStreamResponse();
  } catch (error) {
    console.error("Chat API error:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
