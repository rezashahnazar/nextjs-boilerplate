import { Message } from "ai";
import { useMemo } from "react";

interface ProcessedMessage extends Omit<Message, "createdAt"> {
  createdAt: Date;
}

interface UseProcessedMessagesResult {
  lastMessage: ProcessedMessage | undefined;
  otherMessages: ProcessedMessage[];
}

export function useProcessedMessages(
  messages: Message[]
): UseProcessedMessagesResult {
  // Process all messages
  const processedMessages = messages.map((message) => ({
    ...message,
    createdAt: message.createdAt ? new Date(message.createdAt) : new Date(),
  }));

  // Get the last message without memoization so it can update freely during streaming
  const lastMessage = processedMessages[processedMessages.length - 1];

  // Memoize only the other messages since they don't change during streaming
  const otherMessages = useMemo(() => {
    return processedMessages.slice(0, -1);
  }, [processedMessages]);

  return {
    lastMessage,
    otherMessages,
  };
}
