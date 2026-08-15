"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { hasLocalApiKey } from "@/app/actions";

export type Message = {
  role: "system" | "user" | "assistant";
  content: string;
};

export type Preset = {
  id: string;
  name: string;
  prompt: string;
};

type AppState = {
  apiKey: string;
  setApiKey: (key: string) => void;
  systemPrompt: string;
  setSystemPrompt: (prompt: string) => void;
  presets: Preset[];
  savePreset: (name: string, prompt: string) => void;
  deletePreset: (id: string) => void;
  messages: Message[];
  setMessages: (messages: Message[] | ((prev: Message[]) => Message[])) => void;
  clearChat: () => void;
  useLocalProxy: boolean;
  isInitializing: boolean;
};

const AppContext = createContext<AppState | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  // API key is runtime only!
  const [apiKey, setApiKey] = useState("");
  const [useLocalProxy, setUseLocalProxy] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    hasLocalApiKey().then(hasKey => {
      setUseLocalProxy(hasKey);
      setIsInitializing(false);
    }).catch(() => setIsInitializing(false));
  }, []);
  
  // Chat state
  const [messages, setMessages] = useState<Message[]>([]);
  const [systemPrompt, setSystemPrompt] = useState("");

  // Presets (can be persisted locally)
  const [presets, setPresets] = useState<Preset[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem("hyperion_presets");
        if (saved) return JSON.parse(saved);
      } catch {
        // Ignore
      }
    }
    return [];
  });

  const savePreset = (name: string, prompt: string) => {
    const newPresets = [...presets, { id: crypto.randomUUID(), name, prompt }];
    setPresets(newPresets);
    try {
      localStorage.setItem("hyperion_presets", JSON.stringify(newPresets));
    } catch {
      // Ignore
    }
  };

  const deletePreset = (id: string) => {
    const newPresets = presets.filter(p => p.id !== id);
    setPresets(newPresets);
    try {
      localStorage.setItem("hyperion_presets", JSON.stringify(newPresets));
    } catch {
      // Ignore
    }
  };

  const clearChat = () => {
    setMessages([]);
    setSystemPrompt("");
  };

  return (
    <AppContext.Provider
      value={{
        apiKey,
        setApiKey,
        systemPrompt,
        setSystemPrompt,
        presets,
        savePreset,
        deletePreset,
        messages,
        setMessages,
        clearChat,
        useLocalProxy,
        isInitializing,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useAppStore() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppStore must be used within an AppProvider");
  }
  return context;
}
