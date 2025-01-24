import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "وبسایت شخصی رضا شاه‌نظر",
  description:
    "وبسایت شخصی رضا شاه‌نظر.",
  authors: [
    { name: "Reza Shahnazar", url: "https://github.com/rezashahnazar" },
  ],
  creator: "Reza Shahnazar",
  metadataBase: new URL("https://shahnazar.me"),
  openGraph: {
    title: "وبسایت شخصی رضا شاه‌نظر",
    description:
      "وبسایت شخصی رضا شاه‌نظر.",
    type: "website",
    url: "https://shahnazar.me", // Replace with your actual domain
    siteName: "وبسایت شخصی رضا شاه‌نظر",
    images: [
      {
        url: "https://shahnazar.me/opengraph-image",
        width: 1200,
        height: 630,
        alt: "وبسایت شخصی رضا شاه‌نظر",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "وبسایت شخصی رضا شاه‌نظر",
    description:
      "وبسایت شخصی رضا شاه‌نظر.",
    images: ["https://shahnazar.me/opengraph-image"],
  },
};
