// src/stores/chatStore.ts
"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: number;
}

export interface ChatConversation {
  id: string;
  title: string;
  messages: ChatMessage[];
  createdAt: number;
  updatedAt: number;
  context?: {
    surahId?: number;
    surahName?: string;
    ayahNumber?: number;
  };
}

interface ChatStore {
  conversations: ChatConversation[];
  activeConversationId: string | null;

  createConversation: (title?: string) => string;
  setActiveConversation: (id: string | null) => void;
  getActiveConversation: () => ChatConversation | null;
  addMessage: (conversationId: string, message: Omit<ChatMessage, "id" | "timestamp">) => void;
  updateLastAssistantMessage: (conversationId: string, content: string) => void;
  renameConversation: (id: string, title: string) => void;
  deleteConversation: (id: string) => void;
  clearAll: () => void;
}

function genId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

function deriveTitle(content: string): string {
  const trimmed = content.trim().slice(0, 60);
  return trimmed.length < content.trim().length ? trimmed + "..." : trimmed;
}

export const useChatStore = create<ChatStore>()(
  persist(
    (set, get) => ({
      conversations: [],
      activeConversationId: null,

      createConversation: (title) => {
        const id = genId();
        const now = Date.now();
        const newConv: ChatConversation = {
          id,
          title: title ?? "New conversation",
          messages: [],
          createdAt: now,
          updatedAt: now,
        };
        set((state) => ({
          conversations: [newConv, ...state.conversations],
          activeConversationId: id,
        }));
        return id;
      },

      setActiveConversation: (id) => {
        set({ activeConversationId: id });
      },

      getActiveConversation: () => {
        const { conversations, activeConversationId } = get();
        return conversations.find((c) => c.id === activeConversationId) ?? null;
      },

      addMessage: (conversationId, message) => {
        const id = genId();
        const now = Date.now();
        set((state) => ({
          conversations: state.conversations.map((c) => {
            if (c.id !== conversationId) return c;
            const isFirstUserMsg =
              c.messages.length === 0 && message.role === "user";
            return {
              ...c,
              title: isFirstUserMsg ? deriveTitle(message.content) : c.title,
              messages: [...c.messages, { ...message, id, timestamp: now }],
              updatedAt: now,
            };
          }),
        }));
      },

      updateLastAssistantMessage: (conversationId, content) => {
        set((state) => ({
          conversations: state.conversations.map((c) => {
            if (c.id !== conversationId) return c;
            const messages = [...c.messages];
            // Find last assistant message
            for (let i = messages.length - 1; i >= 0; i--) {
              if (messages[i].role === "assistant") {
                messages[i] = { ...messages[i], content };
                break;
              }
            }
            return { ...c, messages, updatedAt: Date.now() };
          }),
        }));
      },

      renameConversation: (id, title) => {
        set((state) => ({
          conversations: state.conversations.map((c) =>
            c.id === id ? { ...c, title, updatedAt: Date.now() } : c
          ),
        }));
      },

      deleteConversation: (id) => {
        set((state) => ({
          conversations: state.conversations.filter((c) => c.id !== id),
          activeConversationId:
            state.activeConversationId === id ? null : state.activeConversationId,
        }));
      },

      clearAll: () => {
        set({ conversations: [], activeConversationId: null });
      },
    }),
    { name: "tarteel-chat-history" }
  )
);