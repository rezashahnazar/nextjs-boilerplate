import { useState, useEffect, useRef } from "react";
import { Copy, RotateCcw } from "lucide-react";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ActionButton } from "./action-button";

interface MessageActionsProps {
  isUser: boolean;
  content: string;
  onRetry?: () => void;
}

const copyToClipboard = async (text: string) => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (err) {
    console.error("Failed to copy text:", err);
    return false;
  }
};

export function MessageActions({
  isUser,
  content,
  onRetry,
}: MessageActionsProps) {
  const [copied, setCopied] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const timeoutRef = useRef<{
    animation?: NodeJS.Timeout;
    reset?: NodeJS.Timeout;
  }>({});

  useEffect(() => {
    // Capture current timeouts at effect execution time
    const timeouts = timeoutRef.current;

    return () => {
      if (timeouts.animation) {
        clearTimeout(timeouts.animation);
      }
      if (timeouts.reset) {
        clearTimeout(timeouts.reset);
      }
    };
  }, []);

  const handleCopy = async () => {
    if (copied) return;

    const success = await copyToClipboard(content);
    if (success) {
      setCopied(true);
      setIsAnimating(true);

      timeoutRef.current.animation = setTimeout(() => {
        setIsAnimating(false);
      }, 800);

      timeoutRef.current.reset = setTimeout(() => {
        setCopied(false);
      }, 2000);
    }
  };

  // Only show copy button for assistant messages
  const showCopy = !isUser;

  return (
    <div className="flex gap-4 h-full w-fit">
      <TooltipProvider>
        {onRetry && (
          <ActionButton
            onClick={onRetry}
            tooltipText="تلاش مجدد"
            icon={RotateCcw}
          />
        )}
        {showCopy && (
          <ActionButton
            copied={copied}
            isAnimating={isAnimating}
            onClick={handleCopy}
            tooltipText={copied ? "کپی شد" : "کپی متن"}
            icon={Copy}
          />
        )}
      </TooltipProvider>
    </div>
  );
}
