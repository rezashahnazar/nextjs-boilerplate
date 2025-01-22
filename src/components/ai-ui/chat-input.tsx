import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FormEvent } from "react";
import { StopCircle, Link2, Calendar, Globe, ArrowUp } from "lucide-react";
import { cn } from "@/lib/utils";

interface ChatInputProps {
  input: string;
  isLoading: boolean;
  onSubmit: (e: FormEvent<HTMLFormElement>) => void;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
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
  return (
    <div className="relative h-full flex flex-col w-full rounded-2xl overflow-hidden bg-transparen">
      <form
        onSubmit={onSubmit}
        className="relative flex flex-col gap-2 rounded-2xl overflow-hidden bg-muted p-3 h-full "
      >
        <Input
          value={input}
          onChange={onInputChange}
          autoComplete="off"
          spellCheck="false"
          placeholder="پیام خود را اینجا بنویسید..."
          className="flex-1 bg-transparent text-[13px] text-foreground placeholder:text-muted-foreground placeholder:text-[13px] border-0 px-0 pr-0.5 focus-visible:ring-0 focus-visible:ring-offset-0"
          disabled={isLoading}
        />
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 mt-1">
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
