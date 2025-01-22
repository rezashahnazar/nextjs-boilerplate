import { cn } from "@/lib/utils";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { UserAvatar, AssistantAvatar } from "./avatars";
import { MessageItemProps } from "./types/message";
import { createMarkdownComponents } from "./markdown-components";
import { CodeBlock } from "./code-block";
import { useMemo } from "react";

const TIME_FORMAT_OPTIONS = {
  hour: "2-digit",
  minute: "2-digit",
} as const;

const AVATAR_CONTAINER_CLASSES =
  "flex h-8 w-8 shrink-0 select-none items-center justify-center";

export function MessageItem({ role, content, createdAt }: MessageItemProps) {
  const isUser = role === "user";
  const Avatar = isUser ? UserAvatar : AssistantAvatar;

  // Memoize markdown components to prevent recreation on every render
  const markdownComponents = useMemo(
    () => createMarkdownComponents({ isUser }),
    [isUser]
  );

  const classes = {
    container: cn("flex gap-3 py-4", isUser ? "flex-row" : "flex-row-reverse"),
    content: cn("flex flex-1", isUser ? "justify-start" : "justify-end"),
    message: cn("max-w-[85%]", !isUser && "bg-muted rounded-2xl px-4 py-3"),
    messageContent: cn("text-right w-full"),
    time: cn(
      "block text-[10px] text-muted-foreground/50 mt-2",
      isUser ? "text-right" : "text-left"
    ),
  };

  const formatTime = (date: Date) =>
    date.toLocaleTimeString("fa-IR", TIME_FORMAT_OPTIONS);

  // Memoize the code block component
  const CodeBlockComponent = useMemo(
    () => (props: any) => <CodeBlock {...props} isUser={isUser} />,
    [isUser]
  );

  return (
    <div className={classes.container}>
      <div className={AVATAR_CONTAINER_CLASSES}>
        <Avatar />
      </div>
      <div className={classes.content}>
        <div className={classes.message}>
          <div className={classes.messageContent}>
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                ...markdownComponents,
                code: CodeBlockComponent,
              }}
              skipHtml
            >
              {content}
            </ReactMarkdown>
            {createdAt && (
              <time dateTime={createdAt.toISOString()} className={classes.time}>
                {formatTime(createdAt)}
              </time>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
