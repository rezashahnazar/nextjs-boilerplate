import { cn } from "@/lib/utils";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { UserAvatar, AssistantAvatar } from "./avatars";
import { MessageItemProps } from "./types/message";
import { createMarkdownComponents } from "./markdown-components";
import { CodeBlock } from "./code-block";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Copy, RotateCcw, Check } from "lucide-react";

const TIME_FORMAT_OPTIONS = {
  hour: "2-digit",
  minute: "2-digit",
} as const;

const AVATAR_CONTAINER_CLASSES =
  "flex h-8 w-8 shrink-0 select-none items-center justify-center";

export function MessageItem({
  role,
  content,
  createdAt,
  onRetry,
}: MessageItemProps) {
  const isUser = role === "user";
  const Avatar = isUser ? UserAvatar : AssistantAvatar;
  const [copied, setCopied] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  // Memoize markdown components to prevent recreation on every render
  const markdownComponents = useMemo(
    () => createMarkdownComponents({ isUser }),
    [isUser]
  );

  const classes = {
    container: cn("flex gap-3 py-6", isUser ? "flex-row" : "flex-row-reverse"),
    content: cn("flex flex-1", isUser ? "justify-start" : "justify-end"),
    message: cn(
      "max-w-[85%] relative",
      !isUser && "bg-muted rounded-2xl px-6 py-4"
    ),
    messageContent: cn(
      "text-right w-full text-[13px] leading-[1.8]",
      isUser ? "whitespace-pre-line" : "whitespace-normal",
      "break-words"
    ),
    footer: cn(
      "flex items-center justify-between mt-2",
      isUser && "flex-row-reverse"
    ),
    time: cn(
      "text-[10px] text-muted-foreground/50",
      isUser ? "text-left" : "text-right"
    ),
    actions: cn("flex gap-3", isUser ? "flex-row" : "flex-row-reverse"),
    actionButton: cn(
      "h-4 w-4 hover:bg-muted/80 transition-all duration-200",
      "text-muted-foreground/50 hover:text-muted-foreground"
    ),
    copyButton: cn(
      "h-4 w-4 relative transition-all duration-200",
      "text-muted-foreground/50 hover:text-muted-foreground group",
      copied && "text-green-500 hover:text-green-600"
    ),
    copyIconWrapper: cn(
      "absolute inset-0 flex items-center justify-center transition-all duration-200",
      copied
        ? "scale-0 rotate-[-180deg] opacity-0"
        : "scale-100 rotate-0 opacity-100"
    ),
    checkIconWrapper: cn(
      "absolute inset-0 flex items-center justify-center transition-all duration-200",
      !copied
        ? "scale-0 rotate-[180deg] opacity-0"
        : "scale-100 rotate-0 opacity-100"
    ),
    successRing: cn(
      "absolute inset-[-4px] rounded-full border-2 transition-all duration-500",
      isAnimating
        ? "border-green-500 scale-110 opacity-0"
        : "border-transparent scale-100 opacity-100"
    ),
    actionIcon: "h-2.5 w-2.5",
  };

  const formatTime = (date: Date) =>
    date.toLocaleTimeString("fa-IR", TIME_FORMAT_OPTIONS);

  // Process assistant content to handle newlines properly
  const processedContent = isUser ? content : content.split("\n").join("  \n");

  // Memoize the code block component
  const CodeBlockComponent = useMemo(
    () => (props: any) => <CodeBlock {...props} isUser={isUser} />,
    [isUser]
  );

  const handleCopy = async () => {
    if (copied) return;

    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      setIsAnimating(true);

      // Reset the animation state slightly before the copy state
      setTimeout(() => setIsAnimating(false), 500);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy text:", err);
    }
  };

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
                p: ({ children }) => (
                  <p
                    className={cn(
                      "my-0 text-[13px] leading-[1.8]",
                      !isUser && "whitespace-pre-wrap"
                    )}
                  >
                    {children}
                  </p>
                ),
              }}
              skipHtml
            >
              {processedContent}
            </ReactMarkdown>
            <div className={classes.footer}>
              <div className={classes.actions}>
                <TooltipProvider>
                  {!isUser && (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className={classes.copyButton}
                          onClick={handleCopy}
                        >
                          <div className={classes.successRing} />
                          <div className={classes.copyIconWrapper}>
                            <Copy className={classes.actionIcon} />
                          </div>
                          <div className={classes.checkIconWrapper}>
                            <Check className={classes.actionIcon} />
                          </div>
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{copied ? "کپی شد" : "کپی متن"}</p>
                      </TooltipContent>
                    </Tooltip>
                  )}
                  {!isUser && onRetry && (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className={classes.actionButton}
                          onClick={onRetry}
                        >
                          <RotateCcw className={classes.actionIcon} />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>تلاش مجدد</p>
                      </TooltipContent>
                    </Tooltip>
                  )}
                </TooltipProvider>
              </div>
              {createdAt && (
                <time
                  dateTime={createdAt.toISOString()}
                  className={classes.time}
                >
                  {formatTime(createdAt)}
                </time>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
