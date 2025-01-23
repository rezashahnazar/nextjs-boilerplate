import { useCallback, useEffect, useRef } from "react";
import { MessageItem } from "./message-item";
import { LoadingIndicator } from "./loading-indicator";
import { cn } from "@/lib/utils";
import { useScrollControl } from "@/hooks/use-scroll-control";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import * as ScrollArea from "@radix-ui/react-scroll-area";
import { useAiChat } from "./ai-chat-provider";
import { Message } from "ai";

// Types
interface MessageListProps {
  className?: string;
}

interface ScrollButtonProps {
  visible: boolean;
  onClick: () => void;
}

interface MessagesProps {
  messages: {
    lastMessage?: Message;
    otherMessages: Message[];
  };
  isLoading: boolean;
  error: Error | null;
  reload: () => void;
}

interface ErrorMessageProps {
  onRetry: () => void;
}


// Constants
const SCROLL = {
  threshold: 200,
  delay: 100,
} as const;

// Styles
const styles = {
  scroll: {
    root: (className?: string) =>
      cn(
        "px-4 md:px-6 flex-1 min-h-0",
        "h-full relative container",
        "overflow-hidden touch-none select-none",
        className
      ),
    viewport: "h-full w-full",
    bar: cn(
      "flex touch-none select-none",
      "h-full w-1.5 border-l border-l-transparent p-[1px]",
      "opacity-30 hover:opacity-100 transition-opacity",
      "absolute left-1 top-0"
    ),
    thumb: "relative flex-1 rounded-full bg-border",
  },
  messages: {
    container: "py-4 space-y-4",
  },
  button: (visible: boolean) =>
    cn(
      "fixed bottom-40 left-1/2 -translate-x-1/2 h-8 w-8 rounded-full",
      "bg-background shadow-md hover:bg-accent z-50",
      "transition-opacity duration-200",
      visible ? "opacity-100" : "opacity-0 pointer-events-none"
    ),
} as const;

// Sub-components
function ScrollButton({ visible, onClick }: ScrollButtonProps) {
  return (
    <Button
      onClick={onClick}
      className={styles.button(visible)}
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

function Messages({ messages, isLoading, error, reload }: MessagesProps) {
  const { lastMessage, otherMessages } = messages;

  return (
    <div dir="rtl" className={styles.messages.container}>
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

      {isLoading && lastMessage?.role !== "assistant" && <LoadingIndicator />}
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
      className={styles.scroll.root(className)}
      data-overscroll-behavior="contain"
      scrollHideDelay={SCROLL.delay}
    >
      <ScrollArea.Viewport className={styles.scroll.viewport}>
        {children}
      </ScrollArea.Viewport>

      <ScrollArea.ScrollAreaScrollbar
        orientation="vertical"
        className={styles.scroll.bar}
      >
        <ScrollArea.ScrollAreaThumb className={styles.scroll.thumb} />
      </ScrollArea.ScrollAreaScrollbar>
      <ScrollArea.Corner />
    </ScrollArea.Root>
  );
}

function ErrorMessage({ onRetry }: ErrorMessageProps) {
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

// Main component
export function MessageList({ className }: MessageListProps) {
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
      </ScrollContainer>

      <ScrollButton visible={showButton} onClick={handleScrollToBottom} />
    </>
  );
}


