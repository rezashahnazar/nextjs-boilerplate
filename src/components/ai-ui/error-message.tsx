import { Button } from "@/components/ui/button";

interface ErrorMessageProps {
  onRetry: () => void;
}

export function ErrorMessage({ onRetry }: ErrorMessageProps) {
  return (
    <div className="flex flex-col gap-2 ml-4">
      <span className="text-sm text-destructive">
        خطایی رخ داد. لطفا دوباره تلاش کنید.
      </span>
      <Button variant="outline" size="sm" onClick={onRetry} className="w-max">
        تلاش مجدد
      </Button>
    </div>
  );
}
