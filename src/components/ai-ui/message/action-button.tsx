import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Copy, RotateCcw, Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface ActionButtonProps {
  copied?: boolean;
  isAnimating?: boolean;
  onClick: () => void;
  tooltipText: string;
  icon: typeof Copy | typeof RotateCcw | typeof Check;
}

export function ActionButton({
  copied,
  isAnimating,
  onClick,
  tooltipText,
  icon: Icon,
}: ActionButtonProps) {
  const isCopyIcon = Icon === Copy;

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className={cn(
            "!h-auto !w-auto relative transition-all duration-300 !p-1",
            "text-muted-foreground/50 hover:text-muted-foreground",
            copied && "text-green-500 hover:text-green-600"
          )}
          onClick={onClick}
        >
          {isAnimating && (
            <div
              className={cn(
                "absolute inset-[-4px] rounded-full border-2 transition-all duration-500",
                isAnimating
                  ? "border-green-500 scale-125 opacity-0"
                  : "border-transparent scale-100 opacity-100"
              )}
            />
          )}
          {!isCopyIcon && (
            <div className="flex items-center justify-center">
              <Icon className="!h-[16px] !w-[16px]" />
            </div>
          )}
          {isCopyIcon && (
            <>
              <div
                className={cn(
                  "absolute inset-0 flex items-center justify-center transition-all duration-300",
                  !copied
                    ? "opacity-100 scale-100 rotate-0"
                    : "opacity-0 scale-0 rotate-90"
                )}
              >
                <Icon className="!h-[16px] !w-[16px]" />
              </div>
              <div
                className={cn(
                  "absolute inset-0 flex items-center justify-center transition-all duration-300",
                  copied
                    ? "opacity-100 scale-100 rotate-0"
                    : "opacity-0 scale-0 rotate-90"
                )}
              >
                <Check className="!h-[16px] !w-[16px]" />
              </div>
            </>
          )}
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        <p>{tooltipText}</p>
      </TooltipContent>
    </Tooltip>
  );
}
