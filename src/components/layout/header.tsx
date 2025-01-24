import { ThemeToggle } from "@/components/theme/theme-toggle";
import { Logo } from "@/components/brand/logo";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface HeaderProps {
  className?: string;
}

const HEADER_BASE_CLASSES =
  "sticky top-0 z-50 w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60";
const CONTAINER_CLASSES = "flex h-16 items-center justify-between px-4 md:px-6";
const LOGO_LINK_CLASSES =
  "flex items-center gap-3 transition-colors hover:text-primary";

export function Header({ className }: HeaderProps) {
  return (
    <header className={cn(HEADER_BASE_CLASSES, className)}>
      <div className={CONTAINER_CLASSES}>
        <Link href="/" className={LOGO_LINK_CLASSES} aria-label="صفحه اصلی">
          <Logo className="h-8 w-8" />
          <span className="text-lg font-bold tracking-tight">Next.js RTL</span>
        </Link>

        <ThemeToggle />
      </div>
    </header>
  );
}
