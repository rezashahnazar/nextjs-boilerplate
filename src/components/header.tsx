import { ThemeToggle } from "@/components/theme-toggle";
import { Logo } from "@/components/ui/logo";
import Link from "next/link";
import { cn } from "@/lib/utils";

export function Header({ className }: { className?: string }) {
  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60",
        className
      )}
    >
      <div className="flex h-16 items-center justify-between px-4">
        <Link
          href="/"
          className="flex items-center gap-3 transition-colors hover:text-primary"
          aria-label="صفحه اصلی"
        >
          <Logo className="w-8 h-8" />
          <span className="text-lg font-bold tracking-tight">Next.js RTL</span>
        </Link>

        <ThemeToggle />
      </div>
    </header>
  );
}
