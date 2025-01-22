import { Spinner } from "@/components/ui/spinner";

export function LoadingIndicator() {
  return (
    <div className="flex items-center gap-2 ml-4">
      <Spinner size="sm" />
      <span className="text-sm text-muted-foreground">در حال تایپ...</span>
    </div>
  );
}
