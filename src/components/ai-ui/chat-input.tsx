import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { FormEvent, KeyboardEvent, useRef, useEffect } from "react";
import { StopCircle, Link2, Calendar, Globe, ArrowUp } from "lucide-react";
import { cn } from "@/lib/utils";

interface ChatInputProps {
  input: string;
  isLoading: boolean;
  onSubmit: (e: FormEvent<HTMLFormElement>) => void;
  onInputChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onStop: () => void;
  bottomMessage?: string;
}

export function ChatInput({
  input,
  isLoading,
  onSubmit,
  onInputChange,
  onStop,
  bottomMessage = "پاسخ هوش مصنوعی ممکن است اشتباه باشد.",
}: ChatInputProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const focusTextarea = () => {
    textareaRef.current?.focus();
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter") {
      if (e.shiftKey) {
        return; // Allow Shift+Enter for new line
      }

      e.preventDefault();
      if (input.trim() && !isLoading) {
        formRef.current?.requestSubmit();

        // Reset height and refocus after a short delay
        requestAnimationFrame(() => {
          if (textareaRef.current) {
            textareaRef.current.style.height = "24px";
            textareaRef.current.focus();
          }
        });
      }
    }
  };

  const adjustHeight = () => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    // Reset to auto height and clear previous height
    textarea.style.height = "auto";
    textarea.style.overflow = "hidden";

    // Get the scroll height
    const scrollHeight = textarea.scrollHeight;
    const maxHeight = 6 * 24;

    // Set new height
    const newHeight = Math.min(Math.max(24, scrollHeight), maxHeight);
    textarea.style.height = `${newHeight}px`;
    textarea.style.overflow = newHeight === maxHeight ? "auto" : "hidden";
  };

  // Adjust height on mount and input changes
  useEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    // Initial adjustment
    adjustHeight();

    // Add resize observer to handle font loading
    const resizeObserver = new ResizeObserver(adjustHeight);
    resizeObserver.observe(textarea);

    return () => resizeObserver.disconnect();
  }, []);

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onInputChange(e);
    // Use RAF to ensure the DOM has updated
    requestAnimationFrame(adjustHeight);
  };

  return (
    <div className="w-full">
      <form
        ref={formRef}
        onSubmit={onSubmit}
        className="flex flex-col rounded-2xl bg-muted p-3 shadow-none cursor-text"
        onClick={focusTextarea}
      >
        <div className="flex flex-col shadow-none">
          <Textarea
            ref={textareaRef}
            value={input}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            autoComplete="off"
            spellCheck="false"
            placeholder="پیام خود را اینجا بنویسید..."
            className={cn(
              "w-full bg-transparent",
              "text-[13px] leading-6 text-foreground",
              "placeholder:text-muted-foreground placeholder:text-[13px]",
              "border-0 px-2 py-1",
              "focus-visible:ring-0 focus-visible:ring-offset-0 shadow-none",
              "resize-none",
              "min-h-[24px]",
              "transition-[height] duration-100 ease-out",
              // Firefox scrollbar
              "scrollbar-w-2 scrollbar-track-transparent scrollbar-thumb-accent/50 hover:scrollbar-thumb-accent/70",
              // Webkit scrollbar
              "[&::-webkit-scrollbar]:w-2",
              "[&::-webkit-scrollbar-track]:bg-transparent",
              "[&::-webkit-scrollbar-thumb]:rounded-full",
              "[&::-webkit-scrollbar-thumb]:bg-accent/50",
              "hover:[&::-webkit-scrollbar-thumb]:bg-accent/70",
              // Edge/IE scrollbar
              "[scrollbar-width:thin]",
              "[scrollbar-color:hsl(var(--accent))_transparent]"
            )}
            disabled={isLoading}
            rows={1}
            enterKeyHint="enter"
          />
        </div>
        <div className="flex items-center justify-between mt-1 shadow-none">
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-7 w-7 rounded-lg hover:bg-accent"
            >
              <Link2 className="h-4 w-4 text-muted-foreground" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-7 w-7 rounded-lg hover:bg-accent"
            >
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-7 w-7 rounded-lg hover:bg-accent"
            >
              <Globe className="h-4 w-4 text-muted-foreground" />
            </Button>
          </div>
          {isLoading ? (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={onStop}
              className="h-7 w-7 rounded-lg hover:bg-accent"
            >
              <StopCircle className="h-[15px] w-[15px] text-muted-foreground" />
            </Button>
          ) : (
            <Button
              type="submit"
              variant="ghost"
              size="icon"
              disabled={!input.trim()}
              className="h-7 w-7 rounded-full bg-primary hover:bg-primary/90 disabled:opacity-25 disabled:bg-accent"
            >
              <ArrowUp className="h-[15px] w-[15px] text-primary-foreground" />
            </Button>
          )}
        </div>
      </form>
      <ChatBottomMessage bottomMessage={bottomMessage} />
    </div>
  );
}

function ChatBottomMessage({ bottomMessage }: { bottomMessage: string }) {
  return (
    <div className="text-center relative bottom-0 left-0 right-0 pt-1">
      <span className="text-[10px] text-muted-foreground/50">
        {bottomMessage}
      </span>
    </div>
  );
}
