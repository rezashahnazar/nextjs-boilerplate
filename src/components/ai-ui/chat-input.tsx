import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FormEvent } from "react";
import {
  StopCircle,
  Link2,
  Calendar,
  Globe,
  ArrowUp,
  ChevronDown,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface ChatInputProps {
  input: string;
  isLoading: boolean;
  onSubmit: (e: FormEvent<HTMLFormElement>) => void;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onStop: () => void;
  showScrollButton?: boolean;
  onScrollToBottom?: () => void;
}

export function ChatInput({
  input,
  isLoading,
  onSubmit,
  onInputChange,
  onStop,
  showScrollButton = false,
  onScrollToBottom,
}: ChatInputProps) {
  return (
    <div className="relative h-full flex flex-col">
      {showScrollButton && (
        <Button
          onClick={onScrollToBottom}
          className={cn(
            "fixed bottom-32 left-1/2 -translate-x-1/2 h-8 w-8 rounded-full bg-white shadow-md hover:bg-gray-50 z-50",
            "transition-opacity duration-200",
            showScrollButton ? "opacity-100" : "opacity-0 pointer-events-none"
          )}
          size="icon"
          variant="outline"
        >
          <ChevronDown className="h-5 w-5 text-[#6B6C7B]" />
        </Button>
      )}
      <form
        onSubmit={onSubmit}
        className="relative flex flex-col gap-2 rounded-xl bg-[#F8F8F8] p-3 h-full"
      >
        <Input
          value={input}
          onChange={onInputChange}
          autoComplete="off"
          spellCheck="false"
          placeholder="پیام خود را اینجا بنویسید..."
          className="flex-1 bg-transparent text-[13px] text-[#303030] placeholder:text-[#6B6C7B] placeholder:text-[13px] border-0 p-0 focus-visible:ring-0 focus-visible:ring-offset-0"
          disabled={isLoading}
        />
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-6 w-6 rounded-lg hover:bg-[#ECECF1]"
            >
              <Link2 className="h-[15px] w-[15px] text-[#6B6C7B]" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-6 w-6 rounded-lg hover:bg-[#ECECF1]"
            >
              <Calendar className="h-[15px] w-[15px] text-[#6B6C7B]" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-6 w-6 rounded-lg hover:bg-[#ECECF1]"
            >
              <Globe className="h-[15px] w-[15px] text-[#6B6C7B]" />
            </Button>
          </div>
          {isLoading ? (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={onStop}
              className="h-6 w-6 rounded-lg hover:bg-[#ECECF1]"
            >
              <StopCircle className="h-[15px] w-[15px] text-[#6B6C7B]" />
            </Button>
          ) : (
            <Button
              type="submit"
              variant="ghost"
              size="icon"
              disabled={!input.trim()}
              className="h-6 w-6 rounded-full bg-black hover:bg-black/90 disabled:opacity-25 disabled:bg-[#ECECF1]"
            >
              <ArrowUp className="h-[15px] w-[15px] text-white" />
            </Button>
          )}
        </div>
      </form>
      <ChatBottomMessage />
    </div>
  );
}

function ChatBottomMessage() {
  return (
    <div className="text-center relative bottom-0 left-0 right-0 pt-1">
      <span className="text-xs text-[#8E8EA0]">
        چت‌جی‌پی‌تی اشتباه می‌کند، اما این چت‌بات نه!
      </span>
    </div>
  );
}
