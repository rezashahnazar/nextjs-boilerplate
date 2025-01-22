import { Message } from "ai";
import { MessageItem } from "./message-item";
import { LoadingIndicator } from "./loading-indicator";
import { ErrorMessage } from "./error-message";

interface MessageListProps {
  messages: Message[];
  isLoading: boolean;
  error: Error | undefined;
  onRetry: () => void;
}

export function MessageList({
  messages,
  isLoading,
  error,
  onRetry,
}: MessageListProps) {
  return (
    <div className="space-y-4">
      {messages.map((message) => (
        <MessageItem
          key={message.id}
          role={message.role}
          content={message.content}
        />
      ))}
      {isLoading && <LoadingIndicator />}
      {error && <ErrorMessage onRetry={onRetry} />}
    </div>
  );
}
