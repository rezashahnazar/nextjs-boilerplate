import { cn } from "@/lib/utils";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Message } from "ai";
import { ComponentPropsWithoutRef, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Copy, RotateCcw, Check } from "lucide-react";
import { UserAvatar, AssistantAvatar } from "./avatars";
import { createMarkdownComponents } from "./markdown-components";
import { CodeBlock } from "./code-block";
import { LoadingIndicator } from "./loading-indicator";

/* --------------------------------- Types --------------------------------- */
type MessageRole = Message["role"];

interface MessageItemProps {
  role: MessageRole;
  content: string;
  createdAt?: Date;
  onRetry?: () => void;
  isStreaming?: boolean;
}

export interface CodeProps extends ComponentPropsWithoutRef<"code"> {
  inline?: boolean;
  isUser?: boolean;
}

interface ActionButtonProps {
  copied?: boolean;
  isAnimating?: boolean;
  onClick: () => void;
  tooltipText: string;
  icon: typeof Copy | typeof RotateCcw | typeof Check;
}

/* --------------------------------- Constants --------------------------------- */
const TIME = {
  format: {
    hour: "2-digit",
    minute: "2-digit",
  } as const,
  locale: "fa-IR",
  animation: {
    copy: 800,
    reset: 2000,
  },
} as const;

/* --------------------------------- Styles --------------------------------- */
const styles = {
  base: {
    avatar: "flex h-8 w-8 shrink-0 select-none items-center justify-center",
    text: "my-0 text-[13px] leading-[1.8]",
    icon: "h-2.5 w-2.5",
    loading: "mt-2",
  },

  message: (isUser: boolean) => ({
    container: cn("flex gap-3 py-1", isUser ? "flex-row" : "flex-row-reverse"),
    content: cn("flex flex-1", isUser ? "justify-start" : "justify-end"),
    wrapper: cn(
      "max-w-[85%] relative",
      !isUser && "bg-muted rounded-2xl px-6 py-4"
    ),
    text: cn(
      "text-right w-full text-[13px] leading-[1.8]",
      isUser ? "whitespace-pre-line" : "whitespace-normal",
      "break-words"
    ),
    footer: cn(
      "flex items-end justify-between mt-3",
      isUser && "flex-row-reverse"
    ),
    time: cn(
      "text-[10px] text-muted-foreground/50 translate-y-1",
      isUser ? "text-left" : "text-right"
    ),
    actions: cn("flex gap-6", isUser ? "flex-row" : "flex-row-reverse"),
  }),

  button: (copied: boolean, isAnimating: boolean) => ({
    base: cn(
      "!size-3 relative transition-all duration-300",
      "text-muted-foreground/50 hover:text-muted-foreground",
      copied && "text-green-500 hover:text-green-600"
    ),
    action: cn(
      "!size-3 hover:bg-muted/80 transition-all duration-300",
      "text-muted-foreground/50 hover:text-muted-foreground"
    ),
    icon: {
      wrapper: (visible: boolean) =>
        cn(
          "absolute inset-0 flex items-center justify-center transition-all duration-300",
          visible
            ? "opacity-100 scale-100 rotate-0"
            : "opacity-0 scale-0 rotate-90"
        ),
      ring: cn(
        "absolute inset-[-4px] rounded-full border-2 transition-all duration-500",
        isAnimating
          ? "border-green-500 scale-125 opacity-0"
          : "border-transparent scale-100 opacity-100"
      ),
    },
  }),
} as const;

/* --------------------------------- Utilities --------------------------------- */
const formatTime = (date: Date) =>
  date.toLocaleTimeString(TIME.locale, TIME.format);

const copyToClipboard = async (text: string) => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (err) {
    console.error("Failed to copy text:", err);
    return false;
  }
};

/* --------------------------------- Components --------------------------------- */
const ActionButton = ({
  copied,
  isAnimating,
  onClick,
  tooltipText,
  icon: Icon,
}: ActionButtonProps) => {
  const isCopyIcon = Icon === Copy;
  const showMainIcon = isCopyIcon ? !copied : true;
  const showCheckIcon = !!(isCopyIcon && copied);

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className={styles.button(!!copied, !!isAnimating).base}
          onClick={onClick}
        >
          {!!isAnimating && (
            <div className={styles.button(!!copied, !!isAnimating).icon.ring} />
          )}
          <div
            className={styles
              .button(!!copied, !!isAnimating)
              .icon.wrapper(!!showMainIcon)}
          >
            <Icon className={styles.base.icon} />
          </div>
          {isCopyIcon && (
            <div
              className={styles
                .button(!!copied, !!isAnimating)
                .icon.wrapper(showCheckIcon)}
            >
              <Check className={styles.base.icon} />
            </div>
          )}
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        <p>{tooltipText}</p>
      </TooltipContent>
    </Tooltip>
  );
};

const MessageActions = ({
  isUser,
  content,
  onRetry,
}: Pick<MessageItemProps, "onRetry"> & {
  isUser: boolean;
  content: string;
}) => {
  const [copied, setCopied] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  const handleCopy = async () => {
    if (copied) return;

    const success = await copyToClipboard(content);
    if (success) {
      setCopied(true);
      setIsAnimating(true);

      const animationTimeout = setTimeout(() => {
        setIsAnimating(false);
      }, TIME.animation.copy);

      const resetTimeout = setTimeout(() => {
        setCopied(false);
      }, TIME.animation.reset);

      return () => {
        clearTimeout(animationTimeout);
        clearTimeout(resetTimeout);
      };
    }
  };

  if (isUser) return null;

  return (
    <div className={styles.message(isUser).actions}>
      <TooltipProvider>
        <ActionButton
          copied={copied}
          isAnimating={isAnimating}
          onClick={handleCopy}
          tooltipText={copied ? "کپی شد" : "کپی متن"}
          icon={Copy}
        />
        {onRetry && (
          <ActionButton
            onClick={onRetry}
            tooltipText="تلاش مجدد"
            icon={RotateCcw}
          />
        )}
      </TooltipProvider>
    </div>
  );
};

const MessageContent = ({
  content,
  isUser,
  isStreaming,
}: {
  content: string;
  isUser: boolean;
  isStreaming?: boolean;
}) => {
  const CodeBlockComponent = useMemo(() => {
    const Component = (props: CodeProps) => (
      <CodeBlock {...props} isUser={isUser} />
    );
    Component.displayName = "CodeBlockComponent";
    return Component;
  }, [isUser]);

  const markdownComponents = useMemo(
    () => createMarkdownComponents({ isUser }),
    [isUser]
  );

  const processedContent = isUser ? content : content.split("\n").join("  \n");

  return (
    <>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          ...markdownComponents,
          code: CodeBlockComponent,
          p: ({ children }) => (
            <p
              className={cn(styles.base.text, !isUser && "whitespace-pre-wrap")}
            >
              {children}
            </p>
          ),
        }}
        skipHtml
      >
        {processedContent}
      </ReactMarkdown>
      {isStreaming && (
        <div className={styles.base.loading}>
          <LoadingIndicator />
        </div>
      )}
    </>
  );
};

/* --------------------------------- Main Component --------------------------------- */
export function MessageItem({
  role,
  content,
  createdAt,
  onRetry,
  isStreaming,
}: MessageItemProps) {
  const isUser = role === "user";
  const Avatar = isUser ? UserAvatar : AssistantAvatar;
  const messageStyles = styles.message(isUser);

  return (
    <div className={messageStyles.container}>
      <div className={styles.base.avatar}>
        <Avatar />
      </div>
      <div className={messageStyles.content}>
        <div className={messageStyles.wrapper}>
          <div className={messageStyles.text}>
            <MessageContent
              content={content}
              isUser={isUser}
              isStreaming={isStreaming}
            />
            <div className={messageStyles.footer}>
              <MessageActions
                isUser={isUser}
                content={content}
                onRetry={onRetry}
              />
              {createdAt && (
                <time
                  dateTime={createdAt.toISOString()}
                  className={messageStyles.time}
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
