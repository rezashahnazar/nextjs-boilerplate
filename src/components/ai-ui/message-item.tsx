import { type ComponentPropsWithoutRef } from "react";
import { type Message } from "ai";
import { cn } from "@/lib/utils";
import { UserAvatar, AssistantAvatar } from "./avatars";
import { LoadingIndicator } from "./loading-indicator";
import { MessageContent } from "./message/message-content";
import { MessageActions } from "./message/message-actions";

export interface CodeProps extends ComponentPropsWithoutRef<"code"> {
  inline?: boolean;
  isUser?: boolean;
}

interface MessageItemProps {
  role: Message["role"];
  content: string;
  createdAt?: Date;
  onRetry?: () => void;
  isStreaming?: boolean;
}

const formatTime = (date: Date) =>
  date.toLocaleTimeString("fa-IR", {
    hour: "2-digit",
    minute: "2-digit",
  } as const);

export function MessageItem({
  role,
  content,
  createdAt,
  onRetry,
  isStreaming,
}: MessageItemProps) {
  const isUser = role === "user";

  return (
    <div
      className={cn(
        "flex gap-3 py-1",
        isUser ? "flex-row" : "flex-row-reverse"
      )}
    >
      {/* Avatar Circle */}
      <div className="flex h-8 w-8 rounded-full overflow-hidden shrink-0 select-none items-center justify-center">
        {isUser ? <UserAvatar /> : <AssistantAvatar />}
      </div>

      {/* Message Bubble */}
      <div
        className={cn(
          "flex flex-1 max-w-[85%] relative flex-col justify-between items-stretch gap-3",
          isUser
            ? "bg-transparent"
            : "bg-muted px-6 py-4 rounded-2xl overflow-hidden "
        )}
      >
        {/* Top part: Message content */}
        <MessageContent content={content} isUser={isUser} />

        {/* Bottom part: Loading indicator (when isStreaming) or action buttons + Time (after stream ends) */}
        <div
          className={cn(
            "flex items-end w-full justify-between h-[24px]",
            isUser ? "flex-row" : "flex-row-reverse"
          )}
        >
          {isStreaming ? (
            <LoadingIndicator />
          ) : (
            <>
              {/* Time */}
              <div
                className={cn(
                  "text-[10px] text-muted-foreground/50 translate-y-1 flex w-fit"
                )}
              >
                {formatTime(createdAt || new Date())}
              </div>

              {/* Action buttons */}
              <MessageActions
                isUser={isUser}
                content={content}
                onRetry={onRetry}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
