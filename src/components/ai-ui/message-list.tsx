import { useCallback } from "react";
import { MessageItem } from "./message-item";
import { LoadingIndicator } from "./loading-indicator";
import { ErrorMessage } from "./error-message";
import { cn } from "@/lib/utils";
import { useScrollControl } from "@/hooks/use-scroll-control";
import { useProcessedMessages } from "@/hooks/use-processed-messages";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import * as ScrollArea from "@radix-ui/react-scroll-area";
import { useAiChat } from "./ai-chat-provider";

const SCROLL_THRESHOLD = 200;

export function MessageList({ className }: { className?: string }) {
  const { messages, isLoading, error, reload } = useAiChat();
  const { lastMessage, otherMessages } = useProcessedMessages(messages);

  const { scrollAreaRef, useScrollButton } = useScrollControl({
    SCROLL_THRESHOLD,
  });

  const { showButton, scrollToBottom } = useScrollButton(messages, isLoading);

  const handleScrollToBottom = useCallback(() => {
    scrollToBottom("smooth");
  }, [scrollToBottom]);

  const classes = {
    scrollArea: cn(
      "flex-1 px-4 md:px-6 relative container size-full",
      "overflow-hidden touch-none select-none"
    ),
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
  };

  return (
    <>
      <ScrollArea.Root
        ref={scrollAreaRef}
        className={classes.scrollArea}
        data-overscroll-behavior="contain"
      >
        <ScrollArea.Viewport className="size-full">
          <div dir="rtl" className={cn("py-2 md:py-4 space-y-4", className)}>
            {/* Render the memoized messages (all except the last one) */}
            {otherMessages.map((message) => (
              <MessageItem
                key={message.id}
                role={message.role}
                content={message.content}
                createdAt={
                  message.createdAt ? new Date(message.createdAt) : undefined
                }
                onRetry={message.role === "assistant" ? reload : undefined}
              />
            ))}

            {/* Render the last message separately to handle streaming */}
            {lastMessage && (
              <MessageItem
                key={lastMessage.id}
                role={lastMessage.role}
                content={lastMessage.content}
                createdAt={
                  lastMessage.createdAt
                    ? new Date(lastMessage.createdAt)
                    : undefined
                }
                onRetry={lastMessage.role === "assistant" ? reload : undefined}
              />
            )}

            {isLoading && <LoadingIndicator />}
            {error && <ErrorMessage onRetry={reload} />}
          </div>
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
    </>
  );
}
