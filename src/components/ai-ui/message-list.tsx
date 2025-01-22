import { Message } from "ai";
import { memo } from "react";
import { MessageItem } from "./message-item";
import { LoadingIndicator } from "./loading-indicator";
import { ErrorMessage } from "./error-message";
import { cn } from "@/lib/utils";

interface MessageListProps {
  messages: Message[];
  isLoading: boolean;
  error: Error | undefined;
  onRetry: () => void;
  className?: string;
}

// Memoize individual message items to prevent unnecessary re-renders
const MemoizedMessageItem = memo(MessageItem, (prevProps, nextProps) => {
  // Only re-render if content actually changed
  return prevProps.content === nextProps.content;
});

export function MessageList({
  messages,
  isLoading,
  error,
  onRetry,
  className,
}: MessageListProps) {
  // Get the last message for streaming optimization
  const lastMessage = messages[messages.length - 1];
  const otherMessages = messages.slice(0, -1);

  return (
    <div dir="rtl" className={cn("space-y-4 py-4 md:py-6", className)}>
      {/* Render all messages except the last one */}
      {otherMessages.map((message) => (
        <MemoizedMessageItem
          key={message.id}
          role={message.role}
          content={message.content}
          createdAt={
            message.createdAt ? new Date(message.createdAt) : undefined
          }
        />
      ))}

      {/* Render the last message separately to handle streaming */}
      {lastMessage && (
        <MessageItem
          key={lastMessage.id}
          role={lastMessage.role}
          content={lastMessage.content}
          createdAt={
            lastMessage.createdAt ? new Date(lastMessage.createdAt) : undefined
          }
        />
      )}

      {isLoading && <LoadingIndicator />}
      {error && <ErrorMessage onRetry={onRetry} />}
    </div>
  );
}
