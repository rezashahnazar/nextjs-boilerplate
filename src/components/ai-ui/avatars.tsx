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

      {/* Stylized 'N' with Persian calligraphy influence */}
      <path
        className="stroke-primary"
        strokeWidth="1.2"
        strokeDasharray="50"
        strokeDashoffset="50"
        d="M8 8h1c3 0 3 8 6 8h-1c-3 0-3-8-6-8z"
      >
        <animate
          attributeName="stroke-dashoffset"
          dur="0.6s"
          values="50;0"
          fill="freeze"
          calcMode="spline"
          keySplines="0.3 0 0.2 1"
        />
      </path>

      {/* Decorative dot */}
      <circle cx="15" cy="9" r="1" className="fill-primary opacity-0">
        <animate
          attributeName="opacity"
          dur="0.3s"
          values="0;1"
          fill="freeze"
          begin="0.6s"
        />
        <animate
          attributeName="r"
          dur="2s"
          values="0.8;1;0.8"
          repeatCount="indefinite"
          begin="0.9s"
        />
      </circle>

      {/* Modern accent line */}
      <path
        className="stroke-primary"
        strokeWidth="1"
        strokeDasharray="16"
        strokeDashoffset="16"
        d="M7 16h10"
      >
        <animate
          attributeName="stroke-dashoffset"
          dur="0.4s"
          values="16;0"
          fill="freeze"
          begin="0.8s"
        />
      </path>
    </svg>
  );
}
