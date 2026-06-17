// src/app/(app)/chat/page.tsx
"use client";

import { apiUrl } from "@/lib/apiBase";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Send,
  Loader2,
  Sparkles,
  Trash2,
  Copy,
  Check,
  MessageSquare,
  Plus,
  History,
  X,
  Pencil,
  RotateCw,
} from "lucide-react";
import { toast } from "sonner";
import { cn, timeAgo } from "@/lib/utils";
import { useChatStore } from "@/stores/chatStore";

const SUGGESTED_QUESTIONS = [
  "What is the main theme of Surah Al-Baqarah?",
  "Explain Ayat al-Kursi in depth",
  "What does Tawheed truly mean?",
  "Tell me about the Prophets in the Quran",
  "Difference between Iman and Islam?",
  "Story of Musa and Pharaoh — key lessons?",
];

const ERROR_INDICATORS = [
  "I apologize, I didn't generate",
  "⚠️ Error:",
  "(Response cancelled)",
];

export default function ChatPage() {
  const {
    conversations,
    activeConversationId,
    createConversation,
    setActiveConversation,
    getActiveConversation,
    addMessage,
    updateLastAssistantMessage,
    deleteConversation,
    renameConversation,
  } = useChatStore();

  const [input, setInput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [renameId, setRenameId] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState("");

  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const activeConv = getActiveConversation();
  const messages = activeConv?.messages ?? [];

  // Auto-scroll
  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages, isStreaming]);

  // Auto-resize textarea
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.style.height = "auto";
      inputRef.current.style.height = `${Math.min(
        inputRef.current.scrollHeight,
        160
      )}px`;
    }
  }, [input]);

  // Core streaming function — takes the message history to send
  const streamResponse = useCallback(
    async (convId: string, apiMessages: { role: string; content: string }[]) => {
      setIsStreaming(true);
      abortControllerRef.current = new AbortController();

      // Add empty assistant message immediately
      addMessage(convId, { role: "assistant", content: "" });

      try {
        const res = await fetch(apiUrl("/api/chat"), {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ messages: apiMessages }),
          signal: abortControllerRef.current.signal,
        });

        // Handle non-OK responses
        if (!res.ok) {
          let errorMsg = `HTTP ${res.status}`;
          try {
            const errorJson = await res.json();
            errorMsg = errorJson.error || errorMsg;
          } catch {
            const errorText = await res.text();
            errorMsg = errorText.slice(0, 200) || errorMsg;
          }
          throw new Error(errorMsg);
        }

        if (!res.body) throw new Error("Empty response body");

        // Parse plain text stream (much simpler now)
        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let accumulated = "";
        let firstTokenReceived = false;

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value, { stream: true });
          if (chunk) {
            if (!firstTokenReceived) {
              firstTokenReceived = true;
            }
            accumulated += chunk;
            updateLastAssistantMessage(convId, accumulated);
          }
        }

        // Drain any leftover bytes
        const tail = decoder.decode();
        if (tail) {
          accumulated += tail;
          updateLastAssistantMessage(convId, accumulated);
        }

        if (!accumulated.trim()) {
          updateLastAssistantMessage(
            convId,
            "I apologize, I didn't generate a response. Please try again."
          );
        }
      } catch (err) {
        if ((err as Error).name === "AbortError") {
          updateLastAssistantMessage(convId, "(Response cancelled)");
        } else {
          const msg = (err as Error).message || "Unknown error";
          updateLastAssistantMessage(convId, `⚠️ Error: ${msg}`);
          toast.error(msg.slice(0, 100));
        }
      } finally {
        setIsStreaming(false);
        abortControllerRef.current = null;
      }
    },
    [addMessage, updateLastAssistantMessage]
  );

  const handleSend = async () => {
    const text = input.trim();
    if (!text || isStreaming) return;

    let convId = activeConversationId;
    if (!convId) {
      convId = createConversation();
    }

    const currentConv = useChatStore
      .getState()
      .conversations.find((c) => c.id === convId);

    // Add user message
    addMessage(convId, { role: "user", content: text });
    setInput("");

    // Build api messages (current history + new user message)
    const apiMessages = [
      ...(currentConv?.messages ?? []).map((m) => ({
        role: m.role,
        content: m.content,
      })),
      { role: "user", content: text },
    ];

    await streamResponse(convId, apiMessages);
  };

  const handleRegenerate = async () => {
    if (!activeConversationId || isStreaming) return;
    const conv = useChatStore
      .getState()
      .conversations.find((c) => c.id === activeConversationId);
    if (!conv) return;

    // Find last user message
    const lastUserIdx = [...conv.messages]
      .reverse()
      .findIndex((m) => m.role === "user");
    if (lastUserIdx === -1) {
      toast.error("No previous user message to regenerate from");
      return;
    }
    const actualUserIdx = conv.messages.length - 1 - lastUserIdx;

    // Remove all messages after the last user message
    const trimmedMessages = conv.messages.slice(0, actualUserIdx + 1);

    // Update conversation directly through store
    useChatStore.setState((state) => ({
      conversations: state.conversations.map((c) =>
        c.id === activeConversationId
          ? { ...c, messages: trimmedMessages, updatedAt: Date.now() }
          : c
      ),
    }));

    // Re-stream from this point
    const apiMessages = trimmedMessages.map((m) => ({
      role: m.role,
      content: m.content,
    }));

    await streamResponse(activeConversationId, apiMessages);
  };

  const handleStop = () => {
    abortControllerRef.current?.abort();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleCopy = async (id: string, text: string) => {
    await navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleNewChat = () => {
    setActiveConversation(null);
    setInput("");
    setSidebarOpen(false);
    inputRef.current?.focus();
  };

  const handleSuggested = (q: string) => {
    setInput(q);
    inputRef.current?.focus();
  };

  const handleRename = (id: string) => {
    if (renameValue.trim()) {
      renameConversation(id, renameValue.trim());
    }
    setRenameId(null);
    setRenameValue("");
  };

  const isErrorMessage = (content: string): boolean => {
    return ERROR_INDICATORS.some((indicator) => content.startsWith(indicator));
  };

  const sortedConvs = [...conversations].sort(
    (a, b) => b.updatedAt - a.updatedAt
  );

  // Detect if last assistant message is an error or empty
  const lastMessage = messages[messages.length - 1];
  const lastIsErrorOrEmpty =
    lastMessage?.role === "assistant" &&
    !isStreaming &&
    (isErrorMessage(lastMessage.content) || !lastMessage.content.trim());

  return (
    <div className="flex h-[calc(100vh-4rem)] max-w-7xl mx-auto">
      {/* History Sidebar */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSidebarOpen(false)}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 md:hidden"
            />
            <motion.aside
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className={cn(
                "fixed md:relative top-0 md:top-auto bottom-0 left-0 w-72 z-50 md:z-0",
                "bg-surface-900/95 md:bg-surface-900/40 backdrop-blur-xl",
                "border-r border-white/[0.05] flex flex-col h-full"
              )}
            >
              <div className="flex items-center justify-between p-4 border-b border-white/[0.05]">
                <h3 className="text-sm font-semibold text-surface-100">
                  Chat History
                </h3>
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="md:hidden p-1.5 rounded-lg text-surface-400 hover:text-surface-100 hover:bg-surface-800/60"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <button
                onClick={handleNewChat}
                className="m-3 flex items-center gap-2 px-3 py-2.5 rounded-xl bg-primary-600 hover:bg-primary-500 text-white text-sm font-medium transition-all"
              >
                <Plus className="w-4 h-4" />
                New Chat
              </button>

              <div className="flex-1 overflow-y-auto px-2 pb-3 space-y-1">
                {sortedConvs.length === 0 ? (
                  <p className="text-xs text-surface-500 text-center py-8">
                    No conversations yet
                  </p>
                ) : (
                  sortedConvs.map((conv) => (
                    <div
                      key={conv.id}
                      className={cn(
                        "group relative rounded-xl px-3 py-2.5 cursor-pointer transition-all",
                        activeConversationId === conv.id
                          ? "bg-primary-900/40 border border-primary-700/30"
                          : "hover:bg-surface-800/60 border border-transparent"
                      )}
                      onClick={() => {
                        setActiveConversation(conv.id);
                        setSidebarOpen(false);
                      }}
                    >
                      {renameId === conv.id ? (
                        <input
                          type="text"
                          value={renameValue}
                          onChange={(e) => setRenameValue(e.target.value)}
                          onBlur={() => handleRename(conv.id)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") handleRename(conv.id);
                            if (e.key === "Escape") setRenameId(null);
                          }}
                          autoFocus
                          onClick={(e) => e.stopPropagation()}
                          className="w-full text-sm bg-surface-800 text-surface-100 px-2 py-1 rounded outline-none"
                        />
                      ) : (
                        <>
                          <p
                            className={cn(
                              "text-sm font-medium truncate pr-12",
                              activeConversationId === conv.id
                                ? "text-primary-200"
                                : "text-surface-200"
                            )}
                          >
                            {conv.title}
                          </p>
                          <p className="text-[10px] text-surface-500 mt-0.5">
                            {timeAgo(conv.updatedAt)} ·{" "}
                            {conv.messages.length} messages
                          </p>
                        </>
                      )}

                      {renameId !== conv.id && (
                        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setRenameId(conv.id);
                              setRenameValue(conv.title);
                            }}
                            className="p-1 rounded text-surface-500 hover:text-surface-100 hover:bg-surface-700"
                          >
                            <Pencil className="w-3 h-3" />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteConversation(conv.id);
                              toast.success("Conversation deleted");
                            }}
                            className="p-1 rounded text-surface-500 hover:text-red-400 hover:bg-red-900/30"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main chat area */}
      <div className="flex flex-col flex-1 min-w-0">
        {/* Header */}
        <div className="px-4 md:px-6 py-4 border-b border-white/[0.05] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 rounded-xl text-surface-400 hover:text-surface-100 hover:bg-surface-800/60 transition-all"
            >
              <History className="w-4 h-4" />
            </button>
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-primary-600 to-primary-800 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div className="min-w-0">
              <h1 className="font-semibold text-surface-100 truncate">
                {activeConv?.title ?? "AI Quran Companion"}
              </h1>
              <p className="text-xs text-surface-500">
                Llama 3.3 70B (NVIDIA NIM)
              </p>
            </div>
          </div>

          <button
            onClick={handleNewChat}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-surface-800/60 border border-white/[0.06] text-surface-300 hover:bg-surface-800 text-xs font-medium transition-all"
          >
            <Plus className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">New Chat</span>
          </button>
        </div>

        {/* Messages */}
        <div
          ref={scrollRef}
          className="flex-1 overflow-y-auto px-4 md:px-6 py-6 space-y-6"
        >
          {messages.length === 0 ? (
            <EmptyState onSelect={handleSuggested} />
          ) : (
            messages.map((m, idx) => {
              const isLast = idx === messages.length - 1;
              const isError =
                m.role === "assistant" && isErrorMessage(m.content);

              return (
                <motion.div
                  key={m.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={cn(
                    "flex gap-3",
                    m.role === "user" && "flex-row-reverse"
                  )}
                >
                  <div
                    className={cn(
                      "w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0",
                      m.role === "user"
                        ? "bg-surface-800 text-surface-300"
                        : isError
                        ? "bg-red-900/40 text-red-400"
                        : "bg-gradient-to-br from-primary-600 to-primary-800 text-white"
                    )}
                  >
                    {m.role === "user" ? (
                      <span className="text-xs font-bold">You</span>
                    ) : (
                      <Sparkles className="w-4 h-4" />
                    )}
                  </div>

                  <div className="max-w-[80%] flex flex-col gap-2">
                    <div
                      className={cn(
                        "rounded-2xl px-4 py-3 group relative",
                        m.role === "user"
                          ? "bg-primary-700/30 border border-primary-700/30 text-surface-100"
                          : isError
                          ? "bg-red-950/30 border border-red-800/30 text-red-200"
                          : "bg-surface-900/60 border border-white/[0.05] text-surface-200"
                      )}
                    >
                      <div className="whitespace-pre-wrap leading-relaxed text-sm break-words">
                        {m.content ||
                          (m.role === "assistant" && isStreaming && isLast ? (
                            <span className="inline-flex items-center gap-2 text-surface-500">
                              <Loader2 className="w-3 h-3 animate-spin" />
                              Thinking...
                            </span>
                          ) : (
                            ""
                          ))}
                      </div>

                      {m.role === "assistant" &&
                        m.content &&
                        !isError &&
                        !isStreaming && (
                          <button
                            onClick={() => handleCopy(m.id, m.content)}
                            className="absolute -bottom-2 right-2 p-1.5 rounded-lg bg-surface-800 border border-white/[0.06] text-surface-400 hover:text-surface-100 opacity-0 group-hover:opacity-100 transition-all"
                          >
                            {copiedId === m.id ? (
                              <Check className="w-3 h-3 text-emerald-400" />
                            ) : (
                              <Copy className="w-3 h-3" />
                            )}
                          </button>
                        )}
                    </div>

                    {/* Regenerate button for last error/empty message */}
                    {isLast && isError && !isStreaming && (
                      <button
                        onClick={handleRegenerate}
                        className="self-start flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-primary-900/30 border border-primary-700/30 text-primary-300 hover:bg-primary-800/40 text-xs font-medium transition-all"
                      >
                        <RotateCw className="w-3 h-3" />
                        Regenerate response
                      </button>
                    )}
                  </div>
                </motion.div>
              );
            })
          )}
        </div>

        {/* Action bar — shows regenerate when last message is good but user wants new attempt */}
        {messages.length > 0 &&
          !isStreaming &&
          lastMessage?.role === "assistant" &&
          !lastIsErrorOrEmpty && (
            <div className="px-4 md:px-6 pb-2">
              <button
                onClick={handleRegenerate}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-surface-800/40 border border-white/[0.04] text-surface-400 hover:text-surface-100 hover:border-white/[0.1] text-xs transition-all"
              >
                <RotateCw className="w-3 h-3" />
                Regenerate
              </button>
            </div>
          )}

        {/* Input */}
        <div className="px-4 md:px-6 py-4 border-t border-white/[0.05]">
          <div className="relative flex items-end gap-2">
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask about any verse, theme, or Islamic concept..."
              rows={1}
              disabled={isStreaming}
              className={cn(
                "flex-1 px-4 py-3 rounded-2xl text-sm resize-none",
                "bg-surface-800/60 border border-white/[0.06]",
                "text-surface-100 placeholder:text-surface-500",
                "focus:outline-none focus:border-primary-700/50",
                "min-h-[48px] max-h-40",
                "disabled:opacity-50"
              )}
            />

            {isStreaming ? (
              <button
                type="button"
                onClick={handleStop}
                className="w-12 h-12 rounded-2xl flex items-center justify-center bg-red-600/80 hover:bg-red-600 text-white transition-all flex-shrink-0"
                title="Stop generating"
              >
                <X className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSend}
                disabled={!input.trim()}
                className={cn(
                  "w-12 h-12 rounded-2xl flex items-center justify-center transition-all flex-shrink-0",
                  input.trim()
                    ? "bg-primary-600 hover:bg-primary-500 text-white"
                    : "bg-surface-800 text-surface-600 cursor-not-allowed"
                )}
              >
                <Send className="w-4 h-4" />
              </button>
            )}
          </div>
          <p className="text-[10px] text-surface-600 mt-2 text-center">
            AI responses are for learning. Verify rulings with qualified scholars.
            Press Enter to send, Shift+Enter for new line.
          </p>
        </div>
      </div>
    </div>
  );
}

function EmptyState({ onSelect }: { onSelect: (q: string) => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="w-16 h-16 rounded-3xl bg-gradient-to-br from-primary-600 to-primary-800 flex items-center justify-center mb-4 shadow-glow">
        <MessageSquare className="w-7 h-7 text-white" />
      </div>
      <h2 className="text-xl font-bold text-surface-100 mb-2">
        How can I help you understand the Quran?
      </h2>
      <p className="text-sm text-surface-400 max-w-md mb-8">
        Ask about any verse, theme, story, or Islamic concept.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 w-full max-w-2xl">
        {SUGGESTED_QUESTIONS.map((q) => (
          <button
            key={q}
            type="button"
            onClick={() => onSelect(q)}
            className="text-left px-4 py-3 rounded-xl bg-surface-900/40 border border-white/[0.04] hover:border-primary-700/30 hover:bg-surface-800/60 text-sm text-surface-300 transition-all"
          >
            {q}
          </button>
        ))}
      </div>
    </div>
  );
}