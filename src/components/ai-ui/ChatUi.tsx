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
    <div className="flex flex-col items-center justify-center h-full py-4">
      <Card className="w-full max-w-4xl flex flex-col h-full relative">
        <ScrollArea ref={scrollAreaRef} className="flex-1 h-[calc(100vh-8rem)]">
          <MessageList
            messages={messages}
            isLoading={isLoading}
            error={error}
            onRetry={reload}
          />
        </ScrollArea>

        {showScrollButton && (
          <Button
            size="icon"
            variant="secondary"
            className="absolute bottom-24 right-6 z-50 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 opacity-90 hover:opacity-100 hover:translate-y-[-2px]"
            onClick={() => scrollToBottom("smooth")}
            aria-label="پیمایش به پایین"
          >
            <ChevronDown className="h-5 w-5" />
          </Button>
        )}

        <ChatInput
          input={input}
          isLoading={isLoading}
          onSubmit={handleSubmit}
          onInputChange={handleInputChange}
          onStop={stop}
        />
      </Card>
    </div>
  );
}
