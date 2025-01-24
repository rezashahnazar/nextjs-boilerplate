import { cn } from "@/lib/utils";

export function LoadingIndicator({ className }: { className?: string }) {
  return (
    <div
      role="status"
      aria-label="AI is thinking"
      className={cn(
        "relative flex flex-col items-center justify-center w-full h-fit opacity-20",
        className
      )}
    >
      <div className="relative w-full h-4 bg-muted/20 ">
        <div
          className="absolute inset-0 bg-gradient-to-r rounded-sm from-primary/40 via-primary/80 to-primary/40 animate-gradient-move"
          style={{ backgroundSize: "200% 100%" }}
        />
      </div>

      <span className="sr-only">AI Assistant is thinking...</span>
    </div>
  );
}
