export function UserAvatar() {
  return (
    <svg
      className="h-full w-full"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {/* Layered background using theme colors */}
      <circle cx="12" cy="12" r="10" className="fill-muted" stroke="none" />
      <circle cx="12" cy="12" r="9" className="fill-muted/50" stroke="none" />

      {/* User icon with theme colors */}
      <path
        strokeDasharray="100"
        strokeDashoffset="100"
        className="stroke-primary"
        strokeWidth="1.2"
        d="M12 12.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Z"
      >
        <animate
          attributeName="stroke-dashoffset"
          dur="1s"
          values="100;0"
          fill="freeze"
          calcMode="spline"
          keySplines="0.3 0 0.2 1"
        />
      </path>
      <path
        strokeDasharray="200"
        strokeDashoffset="200"
        className="stroke-primary"
        strokeWidth="1.2"
        d="M18.5 18.5c0 .245-.015.485-.045.72a9.467 9.467 0 0 1-12.91 0A4.992 4.992 0 0 1 5.5 18.5c0-2.761 2.9-5 6.5-5s6.5 2.239 6.5 5Z"
      >
        <animate
          attributeName="stroke-dashoffset"
          dur="1s"
          values="200;0"
          fill="freeze"
          calcMode="spline"
          keySplines="0.3 0 0.2 1"
          begin="0.3s"
        />
      </path>
    </svg>
  );
}

export function AssistantAvatar() {
  return (
    <svg
      className="h-full w-full"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {/* Layered background using theme colors */}
      <circle cx="12" cy="12" r="10" className="fill-muted" stroke="none" />
      <circle cx="12" cy="12" r="9" className="fill-muted/50" stroke="none" />

      {/* Three curved lines suggesting movement and intelligence */}
      <path
        className="stroke-primary"
        strokeWidth="1.2"
        strokeDasharray="30"
        strokeDashoffset="30"
        d="M8 10c2-2 6-2 8 0"
      >
        <animate
          attributeName="stroke-dashoffset"
          dur="0.4s"
          values="30;0"
          fill="freeze"
        />
      </path>

      <path
        className="stroke-primary"
        strokeWidth="1.2"
        strokeDasharray="30"
        strokeDashoffset="30"
        d="M8 12c2-2 6-2 8 0"
      >
        <animate
          attributeName="stroke-dashoffset"
          dur="0.4s"
          values="30;0"
          fill="freeze"
          begin="0.2s"
        />
      </path>

      <path
        className="stroke-primary"
        strokeWidth="1.2"
        strokeDasharray="30"
        strokeDashoffset="30"
        d="M8 14c2-2 6-2 8 0"
      >
        <animate
          attributeName="stroke-dashoffset"
          dur="0.4s"
          values="30;0"
          fill="freeze"
          begin="0.4s"
        />
      </path>
    </svg>
  );
}
