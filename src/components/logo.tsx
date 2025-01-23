import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  size?: number;
}

export function Logo({ className, size = 24 }: LogoProps) {
  return (
    <svg
      className={cn("text-primary", className)}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {/* Layered background using theme colors */}
      <circle cx="12" cy="12" r="10" className="fill-primary" stroke="none" />
      <circle cx="12" cy="12" r="9" className="fill-primary/90" stroke="none" />

      {/* Three curved lines suggesting movement and intelligence */}
      <path
        className="stroke-background"
        strokeWidth="1.5"
        strokeDasharray="30"
        strokeDashoffset="30"
        d="M8 10c2-2 6-2 8 0"
      >
        <animate
          attributeName="stroke-dashoffset"
          dur="0.6s"
          values="30;0"
          fill="freeze"
          calcMode="spline"
          keySplines="0.3 0 0.2 1"
        />
      </path>

      <path
        className="stroke-background"
        strokeWidth="1.5"
        strokeDasharray="30"
        strokeDashoffset="30"
        d="M8 12c2-2 6-2 8 0"
      >
        <animate
          attributeName="stroke-dashoffset"
          dur="0.6s"
          values="30;0"
          fill="freeze"
          calcMode="spline"
          keySplines="0.3 0 0.2 1"
          begin="0.2s"
        />
      </path>

      <path
        className="stroke-background"
        strokeWidth="1.5"
        strokeDasharray="30"
        strokeDashoffset="30"
        d="M8 14c2-2 6-2 8 0"
      >
        <animate
          attributeName="stroke-dashoffset"
          dur="0.6s"
          values="30;0"
          fill="freeze"
          calcMode="spline"
          keySplines="0.3 0 0.2 1"
          begin="0.4s"
        />
      </path>
    </svg>
  );
}
