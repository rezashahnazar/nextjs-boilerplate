import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FormEvent } from "react";

interface ChatInputProps {
  input: string;
  isLoading: boolean;
  onSubmit: (e: FormEvent<HTMLFormElement>) => void;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onStop: () => void;
}

export function ChatInput({
  input,
  isLoading,
  onSubmit,
  onInputChange,
  onStop,
}: ChatInputProps) {
  return (
    <form onSubmit={onSubmit} className="flex items-center gap-2 border-t p-4">
      <Input
        value={input}
        onChange={onInputChange}
        placeholder="پیام خود را بنویسید..."
        className="flex-1"
        disabled={isLoading}
      />
      {isLoading ? (
        <Button type="button" variant="outline" onClick={onStop}>
          توقف
        </Button>
      ) : (
        <Button type="submit" disabled={!input.trim()}>
          ارسال
        </Button>
      )}
    </form>
  );
}
