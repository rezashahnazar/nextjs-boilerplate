"use client";

import { useChat } from "ai/react";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useEffect, useRef, useState, useCallback } from "react";
import { MessageList } from "./message-list";
import { ChatInput } from "./chat-input";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";

export function ChatUI() {
  const {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    isLoading,
    error,
    reload,
    stop,
  } = useChat({
    api: "/api/chat",
    id: "chat-1",
  });

  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const [showScrollButton, setShowScrollButton] = useState(false);

  const scrollToBottom = useCallback((behavior: ScrollBehavior = "smooth") => {
    const scrollElement = scrollAreaRef.current?.querySelector(
      "[data-radix-scroll-area-viewport]"
    ) as HTMLDivElement;

    if (scrollElement) {
      scrollElement.scrollTo({
        top: scrollElement.scrollHeight,
        behavior,
      });
    }
  }, []);

  const checkShouldShowButton = useCallback(() => {
    const scrollElement = scrollAreaRef.current?.querySelector(
      "[data-radix-scroll-area-viewport]"
    ) as HTMLDivElement;

    if (scrollElement) {
      const { scrollTop, scrollHeight, clientHeight } = scrollElement;
      const distanceFromBottom = scrollHeight - scrollTop - clientHeight;
      const threshold = 200;
      setShowScrollButton(distanceFromBottom > threshold);
    }
  }, []);

  // Check scroll position on mount and when messages change
  useEffect(() => {
    checkShouldShowButton();
  }, [checkShouldShowButton, messages]);

  // Add scroll event listener
  useEffect(() => {
    const scrollElement = scrollAreaRef.current?.querySelector(
      "[data-radix-scroll-area-viewport]"
    ) as HTMLDivElement;

    if (scrollElement) {
      scrollElement.addEventListener("scroll", checkShouldShowButton);
      return () =>
        scrollElement.removeEventListener("scroll", checkShouldShowButton);
    }
  }, [checkShouldShowButton]);

  // Auto-scroll effect
  useEffect(() => {
    const scrollElement = scrollAreaRef.current?.querySelector(
      "[data-radix-scroll-area-viewport]"
    ) as HTMLDivElement;

    if (scrollElement) {
      const { scrollTop, scrollHeight, clientHeight } = scrollElement;
      const distanceFromBottom = scrollHeight - scrollTop - clientHeight;
      const isNearBottom = distanceFromBottom < 200;

      if (isNearBottom || messages.length === 0 || isLoading) {
        scrollToBottom(isLoading ? "auto" : "smooth");
      }
    }
  }, [messages, isLoading, scrollToBottom]);

  return (
    <div className="flex flex-col items-center justify-center h-dvh bg-white">
      <Card className="w-full max-w-2xl flex flex-col h-full relative border-0 bg-white shadow-none">
        <ScrollArea
          ref={scrollAreaRef}
          className="flex-1 px-4 md:px-6"
          scrollHideDelay={75}
        >
          <div className="py-4 md:py-6">
            <MessageList
              messages={messages}
              isLoading={isLoading}
              error={error}
              onRetry={reload}
            />
          </div>
        </ScrollArea>

        <div className="bg-white px-4 pb-3 pt-0 md:px-6">
          <ChatInput
            input={input}
            isLoading={isLoading}
            onSubmit={handleSubmit}
            onInputChange={handleInputChange}
            onStop={stop}
            showScrollButton={showScrollButton}
            onScrollToBottom={() => scrollToBottom("smooth")}
          />
        </div>
      </Card>
    </div>
  );
}
