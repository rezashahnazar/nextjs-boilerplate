import { cn } from "@/lib/utils";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { CodeProps } from "./message-item";

const BASE_STYLE = {
  color: "#e5e7eb",
  background: "none",
} as const;

const SYNTAX_THEME = {
  'code[class*="language-"]': {
    color: "#e5e7eb",
    background: "none",
  },
  'pre[class*="language-"]': {
    color: "#e5e7eb",
    background: "none",
  },
  comment: {
    color: "#6b7280",
  },
  function: {
    color: "#93c5fd",
  },
  keyword: {
    color: "#f472b6",
  },
  string: {
    color: "#86efac",
  },
  number: {
    color: "#fcd34d",
  },
  "class-name": {
    color: "#60a5fa",
  },
  operator: {
    color: "#e879f9",
  },
  punctuation: {
    color: "#d1d5db",
  },
  property: {
    color: "#93c5fd",
  },
  variable: {
    color: "#e5e7eb",
  },
  tag: {
    color: "#93c5fd",
  },
  builtin: {
    color: "#f472b6",
  },
  regex: {
    color: "#86efac",
  },
  important: {
    color: "#f472b6",
    fontWeight: "bold",
  },
  bold: {
    fontWeight: "bold",
  },
  italic: {
    fontStyle: "italic",
  },
} as const;

const SYNTAX_HIGHLIGHTER_STYLE = {
  margin: 0,
  background: "transparent",
  padding: "0.75rem",
  fontSize: "0.875rem",
  lineHeight: "1.25rem",
  direction: "ltr",
  textAlign: "left",
} as const;

const DECORATIVE_DOTS = [
  { color: "bg-red-500/70" },
  { color: "bg-yellow-500/70" },
  { color: "bg-green-500/70" },
] as const;

const BLOCK_CLASSES = {
  wrapper: "not-prose rounded-md overflow-hidden my-4 first:mt-0 last:mb-0",
  header:
    "flex items-center justify-between px-4 py-2 bg-zinc-900 border-b border-zinc-700/50",
  language: "text-xs font-medium text-zinc-400",
  dotsContainer: "flex gap-1.5",
  dot: "w-3 h-3 rounded-full",
  codeContainer: "relative bg-zinc-900",
} as const;

const INLINE_CODE_BASE_CLASSES =
  "relative rounded px-1.5 py-1 font-mono text-sm inline-block overflow-wrap-anywhere";

const getInlineCodeThemeClasses = (isUser: boolean) =>
  isUser
    ? "bg-primary-foreground/10 text-primary-foreground"
    : "bg-primary/5 text-foreground";

function BlockCode({
  language,
  children,
}: {
  language: string;
  children: React.ReactNode;
}) {
  return (
    <div className={BLOCK_CLASSES.wrapper}>
      <div className={BLOCK_CLASSES.header}>
        <span className={BLOCK_CLASSES.language}>{language}</span>
        <div className={BLOCK_CLASSES.dotsContainer}>
          {DECORATIVE_DOTS.map(({ color }, index) => (
            <div key={index} className={cn(BLOCK_CLASSES.dot, color)} />
          ))}
        </div>
      </div>
      <div className={BLOCK_CLASSES.codeContainer}>
        <SyntaxHighlighter
          language={language}
          style={SYNTAX_THEME}
          customStyle={SYNTAX_HIGHLIGHTER_STYLE}
          showLineNumbers={false}
          wrapLongLines={true}
          PreTag="div"
        >
          {String(children).replace(/\n$/, "")}
        </SyntaxHighlighter>
      </div>
    </div>
  );
}

export function CodeBlock({
  inline,
  className,
  children,
  isUser,
  ...props
}: CodeProps) {
  const match = /language-(\w+)/.exec(className || "");
  const language = match ? match[1] : "";

  if (!inline && language) {
    return <BlockCode language={language}>{children}</BlockCode>;
  }

  return (
    <code
      dir="ltr"
      className={cn(
        INLINE_CODE_BASE_CLASSES,
        getInlineCodeThemeClasses(isUser ?? false)
      )}
      {...props}
    >
      {children}
    </code>
  );
}
