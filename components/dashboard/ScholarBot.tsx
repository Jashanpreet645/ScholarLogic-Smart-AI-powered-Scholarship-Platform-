"use client";

import { useEffect, useRef, useState, useTransition, useMemo } from "react";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Send,
  User,
  X,
  Trash2,
  Loader2,
} from "lucide-react";
import { getChatHistory, clearChatHistory } from "@/lib/actions/chat.actions";
import { motion, AnimatePresence } from "motion/react";
import SplineViewer from "@/components/layout/SplineViewer";
import { Bot, GraduationCap } from "lucide-react";

const SPLINE_URL = "https://prod.spline.design/RnTW1mtTK6juFjVR/scene.splinecode";

const BOT_NAME = "ScholarBot";
const WELCOME_MESSAGE = `Welcome to ScholarLogic! 🎓 I'm ${BOT_NAME}, your personal AI advisor. I'm here to match you with top-tier scholarships, review your application materials, and effectively guide you through the financial aid process. How can I accelerate your journey today?`;

export default function ScholarBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [historyLoaded, setHistoryLoaded] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [inputValue, setInputValue] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  const transport = useMemo(
    () => new DefaultChatTransport({ api: "/api/chat" }),
    []
  );

  const { messages, sendMessage, status, setMessages } = useChat({
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
  }, [messages, isOpen]);

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
            content: WELCOME_MESSAGE,
            parts: [{ type: "text" as const, text: WELCOME_MESSAGE }],
          },
        ];

  return (
    <>
      {/* Floating Action Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            id="scholarbot-fab"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
            onClick={() => setIsOpen(true)}
            className="fixed bottom-6 right-6 z-50 group cursor-pointer"
            aria-label="Open ScholarBot"
          >
            {/* Glow ring */}
            <span className="absolute inset-0 rounded-full bg-primary/30 animate-ping opacity-30" />
            <span className="absolute -inset-1 rounded-full bg-gradient-to-r from-primary via-purple-500 to-blue-500 opacity-60 blur-md group-hover:opacity-80 transition-opacity duration-500" />
            <span className="relative flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-primary/20 to-purple-600/20 shadow-[0_0_30px_rgba(123,92,250,0.4)] group-hover:shadow-[0_0_40px_rgba(123,92,250,0.6)] transition-shadow duration-500 overflow-hidden">
              <div 
                className="absolute pointer-events-none"
                style={{
                  width: "256px",
                  height: "256px",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -46%) scale(0.35)",
                }}
              >
                <SplineViewer url={SPLINE_URL} className="w-full h-full" />
              </div>
            </span>
            {/* Tooltip */}
            <span className="absolute bottom-full right-0 mb-3 px-3 py-1.5 text-xs font-medium text-popover-foreground bg-popover border border-border rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap pointer-events-none shadow-xl">
              Ask {BOT_NAME} ✨
            </span>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            id="scholarbot-panel"
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="fixed bottom-6 right-6 z-50 w-[400px] h-[560px] max-h-[80vh] flex flex-col rounded-3xl overflow-hidden shadow-2xl dark:shadow-[0_20px_80px_rgba(123,92,250,0.25),0_0_0_1px_rgba(42,40,64,0.8)] border border-border/60 bg-card/95 dark:bg-[#13131A]/95 backdrop-blur-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-border/60 bg-gradient-to-b from-primary/5 to-transparent">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary/20 to-purple-600/20 flex items-center justify-center shadow-[0_0_15px_rgba(123,92,250,0.3)] overflow-hidden relative">
                    <div 
                      className="absolute pointer-events-none"
                      style={{
                        width: "200px",
                        height: "200px",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -46%) scale(0.25)",
                      }}
                    >
                      <SplineViewer url={SPLINE_URL} className="w-full h-full" />
                    </div>
                  </div>
                  {/* Online indicator */}
                  <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-success rounded-full border-2 border-bg-surface" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-foreground tracking-tight">
                    {BOT_NAME}
                  </h3>
                  <p className="text-[11px] text-muted-foreground">
                    AI Scholarship Advisor
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                {messages.length > 0 && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-muted-foreground hover:text-danger hover:bg-danger/10 rounded-lg transition-colors"
                    onClick={handleClearChat}
                    disabled={isPending}
                    title="Clear chat"
                  >
                    {isPending ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Trash2 className="w-3.5 h-3.5" />
                    )}
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-foreground/5 rounded-lg transition-colors"
                  onClick={() => setIsOpen(false)}
                  title="Close"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Messages */}
            <div
              ref={scrollRef}
              className="flex-1 overflow-y-auto px-4 py-4 space-y-3 scrollbar-thin"
            >
              {!historyLoaded ? (
                <div className="flex items-center justify-center h-full">
                  <Loader2 className="h-5 w-5 animate-spin text-primary" />
                </div>
              ) : (
                displayMessages.map((message, i) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.04, duration: 0.25 }}
                    className={`flex items-end gap-2 ${
                      message.role === "user" ? "flex-row-reverse" : ""
                    }`}
                  >
                    {message.role !== "user" && (
                      <div className="w-7 h-7 rounded-full bg-gradient-to-br from-primary/20 to-purple-600/20 flex items-center justify-center shrink-0 shadow-md text-primary">
                        <GraduationCap className="w-4 h-4" />
                      </div>
                    )}
                    {message.role === "user" && (
                      <div className="w-7 h-7 rounded-full bg-primary flex items-center justify-center shrink-0">
                        <User className="w-3.5 h-3.5 text-white" />
                      </div>
                    )}
                    <div
                      className={`px-4 py-3 rounded-2xl max-w-[85%] text-[13.5px] leading-relaxed whitespace-pre-wrap shadow-sm ${
                        message.role === "user"
                          ? "bg-gradient-to-br from-primary to-purple-600 text-white rounded-br-sm"
                          : "bg-background dark:bg-[#1A1A26] border border-border/50 text-foreground rounded-bl-sm"
                      }`}
                    >
                      {getMessageText(message)}
                    </div>
                  </motion.div>
                ))
              )}

              {/* Typing indicator */}
              {isLoading &&
                messages[messages.length - 1]?.role !== "assistant" && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex items-end gap-2"
                  >
                    <div className="w-7 h-7 rounded-full bg-gradient-to-br from-primary/20 to-purple-600/20 flex items-center justify-center shrink-0 shadow-md text-primary">
                      <GraduationCap className="w-4 h-4" />
                    </div>
                    <div className="px-4 py-4 rounded-2xl rounded-bl-sm bg-background dark:bg-[#1A1A26] shadow-sm border border-border/50">
                      <div className="flex gap-1.5">
                        <span className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce [animation-delay:0ms]" />
                        <span className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce [animation-delay:150ms]" />
                        <span className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce [animation-delay:300ms]" />
                      </div>
                    </div>
                  </motion.div>
                )}
            </div>

            {/* Input */}
            <div className="px-5 py-4 border-t border-border/60 bg-muted/20 dark:bg-background/40">
              <form onSubmit={handleSend} className="flex items-center gap-3">
                <Input
                  id="scholarbot-input"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Message ScholarBot..."
                  className="flex-1 bg-background dark:bg-[#1A1A26]/80 shadow-sm border-border/50 text-foreground placeholder:text-muted-foreground text-[14px] rounded-2xl h-11 focus-visible:ring-1 focus-visible:ring-primary/50 focus-visible:border-primary/50 transition-all"
                  disabled={isLoading}
                />
                <Button
                  id="scholarbot-send"
                  type="submit"
                  size="icon"
                  disabled={!inputValue.trim() || isLoading}
                  className="h-11 w-11 rounded-2xl bg-gradient-to-br from-primary to-purple-600 text-white shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all disabled:opacity-40 disabled:hover:translate-y-0 disabled:shadow-none shrink-0"
                >
                  {isLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                </Button>
              </form>
              <p className="text-[10px] text-muted-foreground text-center mt-2 opacity-60">
                Powered by Gemini AI · {BOT_NAME} may make mistakes
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
