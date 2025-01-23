"use client";

import { Message } from "ai";
import { useChat, UseChatOptions } from "ai/react";
import {
  createContext,
  useContext,
  ReactNode,
  useMemo,
  useRef,
  useCallback,
  useEffect,
} from "react";

// ============================================================================
// Types & Constants
// ============================================================================

const TEXTAREA = {
  HEIGHT: 24,
  MAX_LINES: 6,
  INITIAL_HEIGHT: "24px",
} as const;

type ProcessedMessage = Omit<Message, "createdAt"> & { createdAt: Date };

interface ProcessedMessages {
  lastMessage: ProcessedMessage | undefined;
  otherMessages: ProcessedMessage[];
}

interface AiChatContextType {
  messages: Message[];
  input: string;
  isLoading: boolean;
  error: Error | undefined;
  stop: () => void;
  reload: () => void;
  processedMessages: ProcessedMessages;
  formRef: React.RefObject<HTMLFormElement>;
  stopButtonRef: React.RefObject<HTMLButtonElement>;
  focusTextarea: () => void;
  handleInputChange: (
    e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ) => void;
  handleKeyDown: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  adjustTextareaHeight: () => void;
}

// ============================================================================
// Context & Hook
// ============================================================================

const AiChatContext = createContext<AiChatContextType | undefined>(undefined);

export function useAiChat() {
  const context = useContext(AiChatContext);
  if (!context)
    throw new Error("useAiChat must be used within an AiChatProvider");
  return context;
}

// ============================================================================
// Provider Component
// ============================================================================

interface Props extends Partial<UseChatOptions> {
  children: ReactNode;
}

export function AiChatProvider({ children, ...chatOptions }: Props) {
  const chat = useChat({ id: "chat-1", ...chatOptions });
  const { messages, isLoading } = chat;

  const formRef = useRef<HTMLFormElement>(null);
  const stopButtonRef = useRef<HTMLButtonElement>(null);

  // ============================================================================
  // Message Processing
  // ============================================================================

  const processedMessages = messages.map((message) => ({
    ...message,
    createdAt: message.createdAt ? new Date(message.createdAt) : new Date(),
  }));

  const memoizedOtherMessages = useMemo(
    () => processedMessages.slice(0, -1),
    [processedMessages]
  );

  const memoizedLastMessage = useMemo(
    () => processedMessages[processedMessages.length - 1],
    [processedMessages, isLoading ? "loading" : "idle"]
  );

  const lastMessage = isLoading
    ? processedMessages[processedMessages.length - 1]
    : memoizedLastMessage;

  // ============================================================================
  // Textarea Handlers
  // ============================================================================

  const focusTextarea = useCallback(() => {
    formRef.current?.querySelector("textarea")?.focus();
  }, []);

  const adjustTextareaHeight = useCallback(() => {
    const textarea = formRef.current?.querySelector("textarea");
    if (!textarea) return;

    textarea.style.height = "auto";
    textarea.style.overflow = "hidden";

    const maxHeight = TEXTAREA.HEIGHT * TEXTAREA.MAX_LINES;
    const newHeight = Math.min(
      Math.max(TEXTAREA.HEIGHT, textarea.scrollHeight),
      maxHeight
    );

    textarea.style.height = `${newHeight}px`;
    textarea.style.overflow = newHeight === maxHeight ? "auto" : "hidden";
  }, []);

  // ============================================================================
  // Event Handlers
  // ============================================================================

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
      chat.handleInputChange(e as React.ChangeEvent<HTMLInputElement>);
      requestAnimationFrame(adjustTextareaHeight);
    },
    [chat, adjustTextareaHeight]
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === "Enter" && !e.shiftKey && chat.input.trim() && !isLoading) {
        e.preventDefault();
        formRef.current?.requestSubmit();
      }
    },
    [chat.input, isLoading]
  );

  const handleSubmit = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      if (chat.input.trim() && !isLoading) {
        chat.handleSubmit(e);
        requestAnimationFrame(() => {
          const textarea = formRef.current?.querySelector("textarea");
          if (textarea) textarea.style.height = TEXTAREA.INITIAL_HEIGHT;
        });
      }
    },
    [chat, isLoading]
  );

  // ============================================================================
  // Effects
  // ============================================================================

  useEffect(() => {
    isLoading ? stopButtonRef.current?.focus() : focusTextarea();
  }, [isLoading, focusTextarea]);

  useEffect(() => {
    const textarea = formRef.current?.querySelector("textarea");
    if (!textarea) return;

    adjustTextareaHeight();
    const resizeObserver = new ResizeObserver(adjustTextareaHeight);
    resizeObserver.observe(textarea);

    return () => resizeObserver.disconnect();
  }, [adjustTextareaHeight]);

  // ============================================================================
  // Render
  // ============================================================================

  return (
    <AiChatContext.Provider
      value={{
        messages: chat.messages,
        input: chat.input,
        isLoading: chat.isLoading,
        error: chat.error,
        stop: chat.stop,
        reload: chat.reload,
        processedMessages: {
          lastMessage,
          otherMessages: memoizedOtherMessages,
        },
        formRef: formRef as React.RefObject<HTMLFormElement>,
        stopButtonRef: stopButtonRef as React.RefObject<HTMLButtonElement>,
        focusTextarea,
        handleInputChange,
        handleKeyDown,
        handleSubmit,
        adjustTextareaHeight,
      }}
    >
      {children}
    </AiChatContext.Provider>
  );
}
