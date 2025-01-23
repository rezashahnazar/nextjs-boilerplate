import type { JSX } from "react";
import Image from "next/image";
import { createElement } from "react";
import { cn } from "@/lib/utils";

const styles = {
  base: "text-right dir-rtl text-[13px]",
  components: {
    p: "leading-[1.7] overflow-wrap-anywhere text-foreground [&:not(:first-child)]:mt-4",
    strong: "font-semibold text-foreground",
    a: "font-medium underline underline-offset-4 transition-colors hover:text-primary",
    h1: "tracking-tight text-[14px] font-bold mt-6 mb-4 first:mt-0",
    h2: "tracking-tight text-[13.5px] font-semibold mt-5 mb-3",
    h3: "tracking-tight text-[13px] font-medium mt-4 mb-2",
    ul: "mr-5 my-4 space-y-1.5 text-muted-foreground list-none relative",
    ol: "mr-5 my-4 space-y-1.5 text-muted-foreground list-decimal list-inside",
    li: "[&>ul]:mt-2 [&>ol]:mt-2 relative before:[&:not(:has(input))]:content-['•'] before:[&:not(:has(input))]:absolute before:[&:not(:has(input))]:-right-4 before:[&:not(:has(input))]:top-0 pr-2",
    blockquote:
      "border-r-2 border-border pr-4 py-1 my-4 text-muted-foreground italic",
    hr: "my-8 border-border",
    tr: "m-0 p-0 border-t border-border first:border-t-0",
    th: "bg-muted border-b border-r border-border p-3 text-right align-middle font-semibold text-foreground first:rounded-tr-lg last:rounded-tl-lg last:border-r-0",
    td: "border-b border-r border-border p-3 text-right align-middle last:border-r-0 last:rounded-bl-lg first:rounded-br-lg",
    pre: "text-left text-[13px] dir-ltr",
    code: "text-left text-[13px] dir-ltr",
  },
  special: {
    table: {
      wrapper: "w-full my-6 overflow-x-auto",
      table:
        "w-full border-separate border-spacing-0 border border-border rounded-lg",
    },
    img: "rounded-lg border border-border my-6",
  },
} as const;

const create = (tag: keyof JSX.IntrinsicElements, classNames: string) => {
  const Component = ({
    children,
    ...props
  }: JSX.IntrinsicElements[typeof tag]) => {
    const element = createElement(
      tag,
      { className: classNames, ...props },
      children
    );
    return element;
  };
  Component.displayName = `Markdown${
    tag.charAt(0).toUpperCase() + tag.slice(1)
  }`;
  return Component;
};

export const createMarkdownComponents = ({
  isUser = false,
}: {
  isUser?: boolean;
}) => {
  const baseComponents = Object.entries(styles.components).reduce(
    (acc, [tag, classes]) => ({
      ...acc,
      [tag]: create(
        tag as keyof JSX.IntrinsicElements,
        cn(
          tag !== "pre" && tag !== "code" && styles.base,
          classes,
          isUser && tag === "p" && "text-foreground"
        )
      ),
    }),
    {}
  );

  return {
    ...baseComponents,
    table: ({ children, ...props }: JSX.IntrinsicElements["table"]) => {
      const TableWrapper = ({ children }: { children: React.ReactNode }) => (
        <div className={styles.special.table.wrapper}>
          <table className={styles.special.table.table} {...props}>
            {children}
          </table>
        </div>
      );
      TableWrapper.displayName = "MarkdownTable";
      return <TableWrapper>{children}</TableWrapper>;
    },
    img: ({ alt, src, ...props }: JSX.IntrinsicElements["img"]) => {
      const ImageWrapper = () => (
        <Image
          src={src || ""}
          alt={alt || ""}
          className={styles.special.img}
          width={Number(props.width) || 700}
          height={Number(props.height) || 400}
        />
      );
      ImageWrapper.displayName = "MarkdownImage";
      return <ImageWrapper />;
    },
  };
};
