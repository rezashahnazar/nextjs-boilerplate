"use client";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Link2, Calendar, Globe, ArrowUp } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAiChat } from "./ai-chat-provider";

type Props = {
  ChatInput: { disclaimerText?: string; className?: string }
  Action: {
    isLoading: boolean
    stopButtonRef: React.RefObject<HTMLButtonElement | null>
    onStop: () => void
    disabled: boolean
  }
  TextArea: {
    value: string
    onChange: React.ChangeEventHandler<HTMLTextAreaElement>
    onKeyDown: React.KeyboardEventHandler<HTMLTextAreaElement>
    disabled: boolean
  }
  Utility: { icon: LucideIcon; size: string }
}

const config = {
  text: {
    disclaimer: "پاسخ هوش مصنوعی ممکن است اشتباه باشد.",
    placeholder: "پیام خود را اینجا بنویسید...",
  },
  utils: [
    { icon: Link2, size: "!size-5" },
    { icon: Calendar, size: "!size-5" },
    { icon: Globe, size: "!size-5" },
  ],
} as const

const styles = {
  layout: {
    container: cn(
      "w-full container sticky bottom-0 mx-auto",
      "px-4 md:px-6 pb-2 md:pb-3 pt-0",
      "bg-background/80 backdrop-blur-sm"
    ),
    form: "flex flex-col rounded-2xl bg-muted p-3 shadow-none cursor-text",
    textareaWrapper: "flex flex-col shadow-none",
    actionsWrapper: "flex items-center justify-between mt-2 shadow-none",
    utilityWrapper: "flex items-center gap-2",
  },
  textarea: cn(
    "w-full bg-transparent min-h-[24px] text-[13px] leading-6",
    "text-foreground placeholder:text-muted-foreground placeholder:text-[13px]",
    "border-0 px-2 py-1 resize-none",
    "focus-visible:ring-0 focus-visible:ring-offset-0 !shadow-none",
    "transition-[height] duration-100 ease-out",
    "scrollbar-w-2 scrollbar-track-transparent scrollbar-thumb-accent/50",
    "hover:scrollbar-thumb-accent/70",
    "[&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-transparent",
    "[&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-accent/50",
    "hover:[&::-webkit-scrollbar-thumb]:bg-accent/70",
    "[scrollbar-width:thin] [scrollbar-color:hsl(var(--accent))_transparent]"
  ),
  button: {
    utility: "h-7 w-7 rounded-lg hover:bg-accent !opacity-20",
    stop: cn(
      "h-7 w-7 rounded-lg",
      "bg-destructive/10 hover:bg-destructive/20",
      "text-destructive hover:text-destructive",
      "transition-colors duration-200",
      "ring-1 ring-destructive/40 hover:ring-destructive/60"
    ),
    submit: "h-7 w-7 rounded-full bg-primary hover:bg-primary/90 disabled:opacity-25 disabled:bg-accent",
  },
  icon: {
    stop: "h-[10px] w-[10px] bg-current rounded-[2px]",
    submit: "h-[15px] w-[15px] text-primary-foreground",
  },
  disclaimer: {
    wrapper: "text-center relative bottom-0 left-0 right-0 pt-1",
    text: "text-[10px] text-muted-foreground/50",
  },
} as const

export function ChatInput({ disclaimerText = config.text.disclaimer, className }: Props["ChatInput"]) {
  const {
    input,
    isLoading,
    handleInputChange,
    handleSubmit,
    handleKeyDown,
    stop,
    formRef,
    stopButtonRef,
    focusTextarea,
  } = useAiChat()

  return (
    <div className={cn(styles.layout.container, className)}>
      <form ref={formRef} onSubmit={handleSubmit} onClick={focusTextarea} className={styles.layout.form}>
        <ChatTextarea
          value={input}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          disabled={isLoading}
        />
        <div className={styles.layout.actionsWrapper}>
          <UtilityButtons />
          <ActionButton
            isLoading={isLoading}
            stopButtonRef={stopButtonRef}
            onStop={stop}
            disabled={!input.trim()}
          />
        </div>
      </form>
      <ChatDisclaimer text={disclaimerText} />
    </div>
  )
}

function ChatTextarea({ value, onChange, onKeyDown, disabled }: Props["TextArea"]) {
  return (
    <div className={styles.layout.textareaWrapper}>
      <Textarea
        value={value}
        onChange={onChange}
        onKeyDown={onKeyDown}
        autoComplete="off"
        spellCheck="false"
        placeholder={config.text.placeholder}
        className={styles.textarea}
        disabled={disabled}
        rows={1}
        enterKeyHint="enter"
      />
    </div>
  )
}

function UtilityButtons() {
  return (
    <div className={styles.layout.utilityWrapper}>
      {config.utils.map(({ icon: Icon, size }, index) => (
        <Button
          key={index}
          type="button"
          variant="ghost"
          size="icon"
          disabled
          className={styles.button.utility}
        >
          <Icon className={cn(size, "text-muted-foreground")} />
        </Button>
      ))}
    </div>
  )
}

function ActionButton({ isLoading, stopButtonRef, onStop, disabled }: Props["Action"]) {
  if (isLoading) {
    return (
      <Button
        ref={stopButtonRef as React.RefObject<HTMLButtonElement>}
        type="button"
        variant="ghost"
        size="icon"
        onClick={onStop}
        className={styles.button.stop}
      >
        <div className={styles.icon.stop} />
      </Button>
    )
  }

  return (
    <Button
      type="submit"
      variant="ghost"
      size="icon"
      disabled={disabled}
      className={styles.button.submit}
    >
      <ArrowUp className={styles.icon.submit} />
    </Button>
  )
}

function ChatDisclaimer({ text }: { text: string }) {
  return (
    <div className={styles.disclaimer.wrapper}>
      <span className={styles.disclaimer.text}>{text}</span>
    </div>
  )
}
