"use client";
import { Message } from "ai";
import { useChat } from "ai/react";
import { createContext, useContext, ReactNode } from "react";

interface AiChatContextType {
  messages: Message[];
  input: string;
  handleInputChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  isLoading: boolean;
  error: Error | undefined;
  reload: () => void;
  stop: () => void;
}

const AiChatContext = createContext<AiChatContextType | undefined>(undefined);

export function useAiChat() {
  const context = useContext(AiChatContext);
  if (!context) {
    throw new Error("useAiChat must be used within an AiChatProvider");
  }
  return context;
}

interface AiChatProviderProps {
  children: ReactNode;
}

export function AiChatProvider({ children }: AiChatProviderProps) {
  const chat = useChat({ api: "/api/chat", id: "chat-1" });

  return (
    <AiChatContext.Provider value={chat}>{children}</AiChatContext.Provider>
  );
}
