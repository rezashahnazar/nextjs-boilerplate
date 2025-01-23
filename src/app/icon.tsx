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
          fontSize: 24,
          background: "transparent",
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "white",
        }}
      >
        <svg
          width="32"
          height="32"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="10" fill="#4F46E5" stroke="none" />
          <circle
            cx="12"
            cy="12"
            r="9"
            fill="rgba(79,70,229,0.9)"
            stroke="none"
          />
          <path stroke="white" strokeWidth="1.5" d="M8 10c2-2 6-2 8 0" />
          <path stroke="white" strokeWidth="1.5" d="M8 12c2-2 6-2 8 0" />
          <path stroke="white" strokeWidth="1.5" d="M8 14c2-2 6-2 8 0" />
        </svg>
      </div>
    ),
    {
      ...size,
    }
  );
}
