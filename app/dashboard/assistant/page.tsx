"use client";

import { useEffect, useRef, useState, useTransition, useMemo } from "react";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Send,
  Bot,
  User,
  Sparkles,
  Trash2,
  Loader2,
} from "lucide-react";
import { getChatHistory, clearChatHistory } from "@/lib/actions/chat.actions";

export default function AssistantPage() {
  const [historyLoaded, setHistoryLoaded] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [inputValue, setInputValue] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  const transport = useMemo(
    () => new DefaultChatTransport({ api: "/api/chat" }),
    []
  );

  const {
    messages,
    sendMessage,
    status,
    setMessages,
  } = useChat({
    transport,
  });

  const isLoading = status === "submitted" || status === "streaming";

  // Load chat history on mount
  useEffect(() => {
    (async () => {
      try {
        const history = await getChatHistory();
        if (history.length > 0) {
          setMessages(
            history.map((m) => ({
              id: m.id,
              role: m.role as "user" | "assistant",
              content: m.content,
              parts: [{ type: "text" as const, text: m.content }],
            }))
          );
        }
      } catch (e) {
        console.error("Failed to load chat history:", e);
      }
      setHistoryLoaded(true);
    })();
  }, [setMessages]);

  // Scroll to bottom on new messages
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  function handleClearChat() {
    startTransition(async () => {
      try {
        await clearChatHistory();
        setMessages([]);
      } catch (e) {
        console.error("Failed to clear chat:", e);
      }
    });
  }

  function handleSend(e: React.FormEvent) {
    e.preventDefault();
    if (!inputValue.trim() || isLoading) return;
    sendMessage({ text: inputValue });
    setInputValue("");
  }

  function getMessageText(
    message: (typeof displayMessages)[number]
  ): string {
    if ("content" in message && typeof message.content === "string") {
      return message.content;
    }
    if ("parts" in message && Array.isArray(message.parts)) {
      return message.parts
        .filter((p): p is { type: "text"; text: string } => p.type === "text")
        .map((p) => p.text)
        .join("");
    }
    return "";
  }

  const displayMessages =
    messages.length > 0
      ? messages
      : [
          {
            id: "welcome",
            role: "assistant" as const,
            content:
              "Hi! I'm your ScholarLogic AI Assistant. I can help you find scholarships, draft emails to admission offices, or answer questions about financial aid. How can I help you today?",
            parts: [{ type: "text" as const, text: "" }],
          },
        ];

  return (
    <div className="flex flex-col h-[calc(100vh-theme(spacing.24))] max-w-4xl mx-auto">
      <div className="mb-4 flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2 flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-primary" />
            AI Assistant
          </h1>
          <p className="text-muted-foreground">
            Chat with our AI to get personalized scholarship advice.
          </p>
        </div>
        {messages.length > 0 && (
          <Button
            variant="outline"
            size="sm"
            className="gap-2 border-border text-muted-foreground hover:text-destructive"
            onClick={handleClearChat}
            disabled={isPending}
          >
            {isPending ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Trash2 className="w-4 h-4" />
            )}
            Clear Chat
          </Button>
        )}
      </div>

      <Card className="flex-1 flex flex-col bg-card border-border overflow-hidden">
        <CardContent
          ref={scrollRef}
          className="flex-1 overflow-y-auto p-4 space-y-4"
        >
          {!historyLoaded ? (
            <div className="flex items-center justify-center h-full">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
            </div>
          ) : (
            displayMessages.map((message) => (
              <div
                key={message.id}
                className={`flex items-start gap-3 ${
                  message.role === "user" ? "flex-row-reverse" : ""
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                    message.role === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary text-secondary-foreground border border-border"
                  }`}
                >
                  {message.role === "user" ? (
                    <User className="w-4 h-4" />
                  ) : (
                    <Bot className="w-4 h-4" />
                  )}
                </div>
                <div
                  className={`px-4 py-2.5 rounded-lg max-w-[80%] text-sm whitespace-pre-wrap ${
                    message.role === "user"
                      ? "bg-primary text-primary-foreground rounded-tr-none"
                      : "bg-secondary/50 border border-border rounded-tl-none"
                  }`}
                >
                  {getMessageText(message)}
                </div>
              </div>
            ))
          )}
          {isLoading && messages[messages.length - 1]?.role !== "assistant" && (
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 bg-secondary text-secondary-foreground border border-border">
                <Bot className="w-4 h-4" />
              </div>
              <div className="px-4 py-2.5 rounded-lg bg-secondary/50 border border-border rounded-tl-none">
                <div className="flex gap-1">
                  <span className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:0ms]" />
                  <span className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:150ms]" />
                  <span className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:300ms]" />
                </div>
              </div>
            </div>
          )}
        </CardContent>

        <div className="p-4 border-t border-border bg-card">
          <form onSubmit={handleSend} className="flex items-center gap-2">
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Ask me anything about scholarships..."
              className="flex-1 bg-background"
              disabled={isLoading}
            />
            <Button
              type="submit"
              size="icon"
              disabled={!inputValue.trim() || isLoading}
              className="bg-primary hover:bg-primary/90 text-white"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
            </Button>
          </form>
        </div>
      </Card>
    </div>
  );
}
