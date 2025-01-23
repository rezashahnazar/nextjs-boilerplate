"use client";

import { useChat } from "ai/react";
import * as ScrollArea from "@radix-ui/react-scroll-area";
import { MessageList } from "../message-list";
import { ChatInput } from "../chat-input";
import { cn } from "@/lib/utils";
import { useScrollControl } from "@/hooks/use-scroll-control";
import { useCallback } from "react";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";

const SCROLL_THRESHOLD = 200;

export function ChatUI({ bottomMessage }: { bottomMessage?: string }) {
  const {
    messages: rawMessages,
    input,
    handleInputChange,
    handleSubmit,
    isLoading,
    error,
    reload,
    stop,
  } = useChat({ api: "/api/chat", id: "chat-1" });

  const messages = rawMessages.map((message) => ({
    ...message,
    createdAt: message.createdAt ? new Date(message.createdAt) : new Date(),
  }));

  const { scrollAreaRef, useScrollButton } = useScrollControl({
    SCROLL_THRESHOLD,
  });

  const { showButton, scrollToBottom } = useScrollButton(messages, isLoading);

  const handleScrollToBottom = useCallback(() => {
    scrollToBottom("smooth");
  }, [scrollToBottom]);

  const classes = {
    root: "size-full flex flex-col relative",
    scrollArea: cn(
      "flex-1 px-4 md:px-6 relative",
      "overflow-hidden touch-none select-none"
    ),
    messageList: "container",
    scrollbar: cn(
      "flex touch-none select-none",
      "h-full w-1.5 border-l border-l-transparent p-[1px]",
      "opacity-30 hover:opacity-100 transition-opacity",
      "absolute left-1 top-0"
    ),
    scrollThumb: "relative flex-1 rounded-full bg-border",
    scrollButton: cn(
      "fixed bottom-40 left-1/2 -translate-x-1/2 h-8 w-8 rounded-full bg-background shadow-md hover:bg-accent z-50",
      "transition-opacity duration-200",
      showButton ? "opacity-100" : "opacity-0 pointer-events-none"
    ),
    inputContainer: cn(
      "w-full container",
      "px-4 md:px-6 pb-3 pt-0",
      "bg-background/80 backdrop-blur-sm"
    ),
  };

  return (
    <div className={classes.root}>
      <ScrollArea.Root
        ref={scrollAreaRef}
        className={classes.scrollArea}
        data-overscroll-behavior="contain"
      >
        <ScrollArea.Viewport className="size-full">
          <MessageList
            messages={messages}
            isLoading={isLoading}
            error={error}
            onRetry={reload}
            className={classes.messageList}
          />
        </ScrollArea.Viewport>
        <ScrollArea.ScrollAreaScrollbar
          orientation="vertical"
          className={classes.scrollbar}
        >
          <ScrollArea.ScrollAreaThumb className={classes.scrollThumb} />
        </ScrollArea.ScrollAreaScrollbar>
        <ScrollArea.Corner />
      </ScrollArea.Root>

      <Button
        onClick={handleScrollToBottom}
        className={classes.scrollButton}
        size="icon"
        variant="outline"
      >
        <ChevronDown className="h-5 w-5 text-muted-foreground" />
      </Button>

      <div className={classes.inputContainer}>
        <ChatInput
          input={input}
          isLoading={isLoading}
          onSubmit={handleSubmit}
          onInputChange={handleInputChange}
          onStop={stop}
          bottomMessage={bottomMessage}
        />
      </div>
    </div>
  );
}
