import { cn } from "@/lib/utils";
import { Message } from "ai";
import { useRef, ComponentPropsWithoutRef } from "react";
import ReactMarkdown, { Components } from "react-markdown";
import remarkGfm from "remark-gfm";
import { format } from "date-fns-jalali";
import { Avatar } from "@/components/ui/avatar";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { useTheme } from "next-themes";

// Custom theme with better visibility
const customTheme = {
  'code[class*="language-"]': {
    color: "#f8fafc", // slate-50
    background: "none",
  },
  'pre[class*="language-"]': {
    color: "#f8fafc", // slate-50
    background: "none",
  },
  comment: {
    color: "#94a3b8", // slate-400
  },
  function: {
    color: "#60a5fa", // blue-400
  },
  keyword: {
    color: "#f472b6", // pink-400
  },
  string: {
    color: "#4ade80", // green-400
  },
  number: {
    color: "#fb923c", // orange-400
  },
  "class-name": {
    color: "#38bdf8", // sky-400
  },
  operator: {
    color: "#e879f9", // fuchsia-400
  },
  punctuation: {
    color: "#cbd5e1", // slate-300
  },
  property: {
    color: "#60a5fa", // blue-400
  },
  variable: {
    color: "#f8fafc", // slate-50
  },
};

interface MessageItemProps {
  role: Message["role"];
  content: string;
  createdAt?: Date;
}

type CodeProps = ComponentPropsWithoutRef<"code"> & {
  inline?: boolean;
};

function UserAvatar() {
  return (
    <svg
      className="h-full w-full"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.25"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {/* Elegant circle background */}
      <circle
        cx="12"
        cy="12"
        r="10"
        className="opacity-10"
        fill="currentColor"
        stroke="none"
      />

      {/* Professional user icon with subtle draw animation */}
      <path
        strokeDasharray="100"
        strokeDashoffset="100"
        d="M12 13a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"
      >
        <animate
          attributeName="stroke-dashoffset"
          dur="0.8s"
          values="100;0"
          fill="freeze"
          calcMode="spline"
          keySplines="0.4 0 0.2 1"
        />
      </path>
      <path
        strokeDasharray="200"
        strokeDashoffset="200"
        d="M19 17.5c0 .245-.015.485-.045.72a9.967 9.967 0 0 1-13.91 0A4.992 4.992 0 0 1 5 17.5c0-2.761 3.134-5 7-5s7 2.239 7 5Z"
      >
        <animate
          attributeName="stroke-dashoffset"
          dur="0.8s"
          values="200;0"
          fill="freeze"
          calcMode="spline"
          keySplines="0.4 0 0.2 1"
          begin="0.2s"
        />
      </path>
    </svg>
  );
}

function AssistantAvatar() {
  return (
    <svg
      className="h-full w-full"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.25"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {/* Elegant circle background */}
      <circle
        cx="12"
        cy="12"
        r="10"
        className="opacity-10"
        fill="currentColor"
        stroke="none"
      />

      {/* Main circuit paths */}
      <g strokeDasharray="120" strokeDashoffset="120">
        <path d="M7 8.5h10M7 12h10M7 15.5h10">
          <animate
            attributeName="stroke-dashoffset"
            dur="0.8s"
            values="120;0"
            fill="freeze"
            calcMode="spline"
            keySplines="0.4 0 0.2 1"
          />
        </path>
      </g>

      {/* Connection dots */}
      <g fill="currentColor">
        <circle cx="7" cy="8.5" r="1" opacity="0">
          <animate
            attributeName="opacity"
            dur="0.3s"
            values="0;1"
            fill="freeze"
            begin="0.8s"
          />
        </circle>
        <circle cx="17" cy="8.5" r="1" opacity="0">
          <animate
            attributeName="opacity"
            dur="0.3s"
            values="0;1"
            fill="freeze"
            begin="0.9s"
          />
        </circle>
        <circle cx="7" cy="12" r="1" opacity="0">
          <animate
            attributeName="opacity"
            dur="0.3s"
            values="0;1"
            fill="freeze"
            begin="1s"
          />
        </circle>
        <circle cx="17" cy="12" r="1" opacity="0">
          <animate
            attributeName="opacity"
            dur="0.3s"
            values="0;1"
            fill="freeze"
            begin="1.1s"
          />
        </circle>
        <circle cx="7" cy="15.5" r="1" opacity="0">
          <animate
            attributeName="opacity"
            dur="0.3s"
            values="0;1"
            fill="freeze"
            begin="1.2s"
          />
        </circle>
        <circle cx="17" cy="15.5" r="1" opacity="0">
          <animate
            attributeName="opacity"
            dur="0.3s"
            values="0;1"
            fill="freeze"
            begin="1.3s"
          />
        </circle>
      </g>

      {/* Vertical connection */}
      <path
        d="M12 7v10"
        strokeDasharray="10"
        strokeDashoffset="10"
        opacity="0.5"
      >
        <animate
          attributeName="stroke-dashoffset"
          dur="0.4s"
          values="10;0"
          fill="freeze"
          begin="1.4s"
          calcMode="spline"
          keySplines="0.4 0 0.2 1"
        />
      </path>
    </svg>
  );
}

export function MessageItem({
  role,
  content,
  createdAt = new Date(),
}: MessageItemProps) {
  const messageRef = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();
  const isDark = theme === "dark";

  if (role === "system" || role === "data") {
    return null;
  }

  const isUser = role === "user";
  const formattedTime = format(createdAt, "HH:mm");

  return (
    <div
      ref={messageRef}
      className={cn(
        "group relative flex items-start gap-3 px-4 py-3",
        isUser ? "flex-row-reverse" : "flex-row"
      )}
      role="listitem"
      aria-label={`پیام از ${isUser ? "شما" : "دستیار"}`}
    >
      <Avatar
        className={cn(
          "h-8 w-8 shrink-0",
          isUser ? "bg-primary/10" : "bg-muted"
        )}
      >
        <div
          className={cn(
            "h-full w-full",
            isUser ? "text-primary" : "text-foreground"
          )}
        >
          {isUser ? <UserAvatar /> : <AssistantAvatar />}
        </div>
      </Avatar>

      <div
        className={cn(
          "flex min-w-0 max-w-[80%] flex-col gap-1",
          "animate-in slide-in-from-bottom-2 fade-in-50 duration-200",
          isUser ? "items-end" : "items-start"
        )}
      >
        <div
          className={cn(
            "flex w-full items-center gap-2 text-sm",
            isUser ? "flex-row-reverse" : "flex-row"
          )}
        >
          <span className="font-medium text-foreground">
            {isUser ? "شما" : "دستیار"}
          </span>
          <time
            dateTime={createdAt.toISOString()}
            className="text-xs text-muted-foreground"
          >
            {formattedTime}
          </time>
        </div>

        <div
          className={cn(
            "relative rounded-lg px-4 py-3 text-sm",
            isUser
              ? "bg-primary text-primary-foreground"
              : "bg-muted text-foreground",
            "shadow-sm transition-all duration-200 ease-in-out hover:shadow-md",
            "ring-1 ring-inset",
            isUser ? "ring-primary/10" : "ring-border"
          )}
        >
          <div
            dir="rtl"
            className={cn(
              "prose prose-sm dark:prose-invert max-w-none break-words",
              isUser && "prose-invert"
            )}
          >
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                p: ({ children }) => (
                  <p dir="rtl" className="text-right !mt-0">
                    {children}
                  </p>
                ),
                h1: ({ children }) => (
                  <h1 dir="rtl" className="text-right">
                    {children}
                  </h1>
                ),
                h2: ({ children }) => (
                  <h2 dir="rtl" className="text-right">
                    {children}
                  </h2>
                ),
                h3: ({ children }) => (
                  <h3 dir="rtl" className="text-right">
                    {children}
                  </h3>
                ),
                ul: ({ children }) => (
                  <ul dir="rtl" className="text-right list-disc mr-5 space-y-2">
                    {children}
                  </ul>
                ),
                ol: ({ children }) => (
                  <ol
                    dir="rtl"
                    className="text-right list-decimal mr-5 space-y-2"
                  >
                    {children}
                  </ol>
                ),
                li: ({ children }) => (
                  <li dir="rtl" className="text-right">
                    {children}
                  </li>
                ),
                blockquote: ({ children }) => (
                  <blockquote
                    dir="rtl"
                    className="text-right border-r-2 border-border pr-4"
                  >
                    {children}
                  </blockquote>
                ),
                code({ inline, className, children, ...props }: CodeProps) {
                  const match = /language-(\w+)/.exec(className || "");
                  const language = match ? match[1] : "";

                  if (!inline && language) {
                    return (
                      <div className="not-prose rounded-md overflow-hidden my-4 first:mt-0 last:mb-0">
                        <div className="flex items-center justify-between px-4 py-2 bg-zinc-900 border-b border-zinc-700/50">
                          <span className="text-xs font-medium text-zinc-400">
                            {language}
                          </span>
                          <div className="flex gap-1.5">
                            <div className="w-3 h-3 rounded-full bg-red-500/70" />
                            <div className="w-3 h-3 rounded-full bg-yellow-500/70" />
                            <div className="w-3 h-3 rounded-full bg-green-500/70" />
                          </div>
                        </div>
                        <div className="relative bg-zinc-900">
                          <SyntaxHighlighter
                            language={language}
                            style={customTheme}
                            customStyle={{
                              margin: 0,
                              background: "transparent",
                              padding: "0.75rem",
                              fontSize: "0.875rem",
                              lineHeight: "1.25rem",
                              direction: "ltr",
                              textAlign: "left",
                            }}
                            showLineNumbers={false}
                            PreTag="div"
                          >
                            {String(children).replace(/\n$/, "")}
                          </SyntaxHighlighter>
                        </div>
                      </div>
                    );
                  }
                  return (
                    <code
                      dir="ltr"
                      className={cn(
                        "relative rounded px-[0.3rem] py-[0.2rem] font-mono text-sm inline-block",
                        isUser ? "bg-primary-foreground/10" : "bg-primary/5"
                      )}
                      {...props}
                    >
                      {children}
                    </code>
                  );
                },
              }}
            >
              {content}
            </ReactMarkdown>
          </div>
        </div>
      </div>
    </div>
  );
}
