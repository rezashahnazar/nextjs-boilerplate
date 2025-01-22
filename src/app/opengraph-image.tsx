import { createOpenGraphImage } from "@/lib/opengraph";

export const runtime = "edge";
export { alt, size, contentType } from "@/lib/opengraph";

export default async function Image() {
  return createOpenGraphImage({
    logo: <Logo />,
    title: "وبسایت با Next.js",
    line1: "بوت‌استرپ حرفه‌ای",
    line2: "برای وب‌سایت‌های فارسی با Next.js",
    background: <GradientBackground />,
  });
}

function Logo() {
  return (
    <svg width="120" height="120" viewBox="0 0 32 32" fill="none">
      <path
        d="M16.731 23.86c-.237.132-.534.132-.771 0l-6.77-3.753c-.237-.131-.385-.377-.385-.645V11.93c0-.268.148-.514.385-.645l6.77-3.753c.237-.132.534-.132.771 0l6.77 3.753c.237.131.385.377.385.645v7.532c0 .268-.148.514-.385.645l-6.77 3.753z"
        fill="white"
      />
      <path
        d="M19.5 13.5L16.5 21.5L13.5 13.5M13.5 13.5H19.5"
        stroke="#000"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function GradientBackground() {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        background: "linear-gradient(125deg, #000000 0%, #1a1a1a 100%)",
        position: "relative",
        display: "flex",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: "-20%",
          left: "-10%",
          width: "60%",
          height: "60%",
          background:
            "radial-gradient(circle, rgba(0, 112, 243, 0.15) 0%, transparent 70%)",
          filter: "blur(40px)",
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: "-30%",
          right: "-10%",
          width: "70%",
          height: "70%",
          background:
            "radial-gradient(circle, rgba(0, 112, 243, 0.1) 0%, transparent 70%)",
          filter: "blur(40px)",
          pointerEvents: "none",
        }}
      />
    </div>
  );
}
