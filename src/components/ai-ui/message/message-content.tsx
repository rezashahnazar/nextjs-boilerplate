import { useMemo } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { cn } from "@/lib/utils";
import { CodeBlock } from "../code-block";
import { createMarkdownComponents } from "../markdown-components";
import type { CodeProps } from "../message-item";

interface MessageContentProps {
  content: string;
  isUser: boolean;
}

export function MessageContent({ content, isUser }: MessageContentProps) {
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

  const newlineProcessedContent = content.split("\n").join("  \n");

  return (
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
    >
      {newlineProcessedContent}
    </ReactMarkdown>
  );
}
