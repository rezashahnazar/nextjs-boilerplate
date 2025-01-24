import { useState } from "react";
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

  const handleCopy = async () => {
    if (copied) return;

    const success = await copyToClipboard(content);
    if (success) {
      setCopied(true);
      setIsAnimating(true);

      const animationTimeout = setTimeout(() => {
        setIsAnimating(false);
      }, 800);

      const resetTimeout = setTimeout(() => {
        setCopied(false);
      }, 2000);

      return () => {
        clearTimeout(animationTimeout);
        clearTimeout(resetTimeout);
      };
    }
  };

  // Only show copy button for assistant messages
  const showCopy = !isUser;

  return (
    <div className="flex gap-6">
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
