import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Next.js RTL Boilerplate",
  description:
    "A professional Next.js boilerplate with RTL support for Persian websites",
  authors: [
    { name: "Reza Shahnazar", url: "https://github.com/rezashahnazar" },
  ],
  creator: "Reza Shahnazar",
  metadataBase: new URL("https://shahnazar.me"),
  openGraph: {
    title: "Next.js RTL Boilerplate",
    description:
      "A Professional Next.js boilerplate with RTL support for Persian websites",
    type: "website",
    url: "https://shahnazar.me", // Replace with your actual domain
    siteName: "Next.js RTL Boilerplate",
    images: [
      {
        url: "https://shahnazar.me/opengraph-image",
        width: 1200,
        height: 630,
        alt: "Next.js RTL Boilerplate",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Next.js RTL Boilerplate",
    description:
      "A Professional Next.js boilerplate with RTL support for Persian websites",
    images: ["https://shahnazar.me/opengraph-image"],
  },
};
