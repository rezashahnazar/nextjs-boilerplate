"use client";

import { useCallback, useEffect, useState } from "react";

export function usePageContent(ref: React.RefObject<HTMLDivElement | null>) {
  const [pageContent, setPageContent] = useState("");

  const extractTextContent = useCallback(() => {
    if (!ref.current) return "";

    // Clone the node to avoid modifying the actual DOM
    const clone = ref.current.cloneNode(true) as HTMLElement;

    // Remove any script and style elements
    const scripts = clone.getElementsByTagName("script");
    const styles = clone.getElementsByTagName("style");
    Array.from(scripts).forEach((script) => script.remove());
    Array.from(styles).forEach((style) => style.remove());

    // Get the text content
    const text = clone.textContent || "";

    // Clean up the text
    return text
      .replace(/\s+/g, " ") // Replace multiple spaces with single space
      .trim();
  }, [ref]);

  useEffect(() => {
    setPageContent(extractTextContent());

    // Set up a mutation observer to update content when DOM changes
    const observer = new MutationObserver(() => {
      setPageContent(extractTextContent());
    });

    if (ref.current) {
      observer.observe(ref.current, {
        childList: true,
        subtree: true,
        characterData: true,
      });
    }

    return () => observer.disconnect();
  }, [extractTextContent, ref]);

  return pageContent;
}
