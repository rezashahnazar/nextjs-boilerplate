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
    type: "website",
    locale: "fa_IR",
    siteName: "Next.js RTL Boilerplate",
  },
};
