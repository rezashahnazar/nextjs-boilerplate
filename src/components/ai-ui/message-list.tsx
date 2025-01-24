"use client";
import { useCallback, useEffect } from "react";
import { MessageItem } from "./message-item";
import { LoadingIndicator } from "./loading-indicator";
import { cn } from "@/lib/utils";
import { useScrollControl } from "@/hooks/use-scroll-control";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import * as ScrollArea from "@radix-ui/react-scroll-area";
import { useAiChat } from "./ai-chat-provider";
import { Message } from "ai";

// Constants
const SCROLL = {
  threshold: 200,
  delay: 100,
} as const;

// Main component
export function MessageList({ className }: { className?: string }) {
  const { messages, isLoading, error, reload, processedMessages } = useAiChat();
  const { scrollAreaRef, useScrollButton } = useScrollControl({
    SCROLL_THRESHOLD: SCROLL.threshold,
  });
  const { showButton, scrollToBottom } = useScrollButton(messages, isLoading);

  const handleScrollToBottom = useCallback(() => {
    scrollToBottom("smooth");
  }, [scrollToBottom]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      scrollToBottom("smooth");
    }, SCROLL.delay);

    return () => clearTimeout(timeoutId);
  }, [scrollToBottom, messages.length]);

  return (
    <>
      <ScrollContainer scrollRef={scrollAreaRef} className={className}>
        <Messages
          messages={processedMessages}
          isLoading={isLoading}
          error={error || null}
          reload={reload}
        />
        <ScrollButton visible={showButton} onClick={handleScrollToBottom} />
      </ScrollContainer>
    </>
  );
}

function ScrollButton({
  visible,
  onClick,
}: {
  visible: boolean;
  onClick: () => void;
}) {
  return (
    <Button
      onClick={onClick}
      className={cn(
        "sticky bottom-4 left-1/2 -translate-x-1/2 h-8 w-8 rounded-full",
        "bg-background shadow-md hover:bg-accent z-50",
        "transition-opacity duration-200",
        visible ? "opacity-100" : "opacity-0 pointer-events-none"
      )}
      size="icon"
      variant="outline"
    >
      <ChevronDown className="h-5 w-5 text-muted-foreground" />
    </Button>
  );
}

function MessageContent({
  message,
  isStreaming,
  onRetry,
}: {
  message: Message;
  isStreaming?: boolean;
  onRetry?: () => void;
}) {
  return (
    <MessageItem
      key={message.id}
      {...message}
      onRetry={message.role === "assistant" ? onRetry : undefined}
      isStreaming={isStreaming}
    />
  );
}

function Messages({
  messages,
  isLoading,
  error,
  reload,
}: {
  messages: { lastMessage?: Message; otherMessages: Message[] };
  isLoading: boolean;
  error: Error | null;
  reload: () => void;
}) {
  const { lastMessage, otherMessages } = messages;

  return (
    <div dir="rtl" className="py-4 space-y-4">
      {otherMessages.map((message) => (
        <MessageContent key={message.id} message={message} onRetry={reload} />
      ))}

      {lastMessage && (
        <MessageContent
          message={lastMessage}
          onRetry={reload}
          isStreaming={isLoading && lastMessage.role === "assistant"}
        />
      )}

      {isLoading && lastMessage?.role !== "assistant" && (
        <LoadingIndicator className="ml-16 max-w-[calc(85%-3rem)] mr-auto" />
      )}
      {error && <ErrorMessage onRetry={reload} />}
    </div>
  );
}

function ScrollContainer({
  children,
  scrollRef,
  className,
}: {
  children: React.ReactNode;
  scrollRef: React.RefObject<HTMLDivElement | null>;
  className?: string;
}) {
  return (
    <ScrollArea.Root
      ref={scrollRef}
      className={cn(
        "px-4 md:px-6 flex-1 min-h-0",
        "h-full relative w-full",
        "overflow-hidden touch-none select-none",
        className
      )}
      data-overscroll-behavior="contain"
      scrollHideDelay={SCROLL.delay}
    >
      <ScrollArea.Viewport className="h-full w-full max-w-4xl mx-auto">
        {children}
      </ScrollArea.Viewport>

      <ScrollArea.ScrollAreaScrollbar
        orientation="vertical"
        className={cn(
          "flex touch-none select-none",
          "h-full w-1.5 border-l border-l-transparent p-[1px]",
          "opacity-30 hover:opacity-100 transition-opacity",
          "absolute left-1 top-0"
        )}
      >
        <ScrollArea.ScrollAreaThumb className="relative flex-1 rounded-full bg-border" />
      </ScrollArea.ScrollAreaScrollbar>
      <ScrollArea.Corner />
    </ScrollArea.Root>
  );
}

function ErrorMessage({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="flex flex-col gap-2 ml-4">
      <span className="text-sm text-destructive">
        خطایی رخ داد. لطفا دوباره تلاش کنید.
      </span>
      <Button variant="outline" size="sm" onClick={onRetry} className="w-max">
        تلاش مجدد
      </Button>
    </div>
  );
}
