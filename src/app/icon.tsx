import { ImageResponse } from "next/og";

export const runtime = "edge";

export const size = {
  width: 32,
  height: 32,
};
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "hsl(var(--primary))",
          borderRadius: 8,
          backgroundImage:
            "linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0) 100%)",
        }}
      >
        <div
          style={{
            width: "24px",
            height: "24px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            style={{ transform: "scale(0.75)" }}
          >
            <path
              d="M12.548 17.895c-.178.099-.4.099-.578 0l-5.077-2.815c-.178-.098-.289-.283-.289-.484V8.947c0-.201.111-.386.289-.484l5.077-2.815c.178-.099.4-.099.578 0l5.077 2.815c.178.098.289.283.289.484v5.649c0 .201-.111.386-.289.484l-5.077 2.815z"
              fill="hsl(var(--primary-foreground))"
            />
            <path
              d="M17.337 8.947v5.649c0 .201-.111.386-.289.484l-5.077 2.815c-.178.099-.4.099-.578 0"
              stroke="hsla(var(--primary-foreground), 0.3)"
              strokeWidth="0.5"
            />
            <g stroke="hsl(var(--primary))">
              <path
                d="M14.75 10.125L12.375 16.125L10 10.125"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M10 10.125H14.75"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </g>
            <circle
              cx="12"
              cy="12"
              r="9"
              stroke="hsla(var(--primary-foreground), 0.1)"
              strokeWidth="0.5"
            />
          </svg>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
