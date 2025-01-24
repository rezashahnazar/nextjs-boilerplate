import "./globals.css";
import { CustomThemeProvider } from "@/components/theme/theme-provider";
import { IRANYekan } from "@/fonts/local-fonts";
import { cn } from "@/lib/utils";
import { Header } from "@/components/layout/header";
import { SkipLink } from "@/components/layout/skip-link";
import { Logo } from "@/components/brand/logo";
import type { Viewport } from "next";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "وبسایت شخصی رضا شاه‌نظر",
  description: "وبسایت شخصی رضا شاه‌نظر.",
  authors: [
    { name: "Reza Shahnazar", url: "https://github.com/rezashahnazar" },
  ],
  creator: "Reza Shahnazar",
  metadataBase: new URL("https://shahnazar.me"),
  openGraph: {
    title: "وبسایت شخصی رضا شاه‌نظر",
    description: "وبسایت شخصی رضا شاه‌نظر.",
    type: "website",
    url: "https://shahnazar.me",
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
    description: "وبسایت شخصی رضا شاه‌نظر.",
    images: ["https://shahnazar.me/opengraph-image"],
  },
};

export const viewport: Viewport = {
  themeColor: "hsl(var(--background))",
  colorScheme: "light dark",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  minimumScale: 1,
  userScalable: false,
  height: "device-height",
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fa-IR" dir="rtl" suppressHydrationWarning>
      <body
        className={cn(
          IRANYekan.className,
          "antialiased bg-background text-foreground"
        )}
      >
        <CustomThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <SkipLink href="#main-content">رفتن به محتوای اصلی</SkipLink>
          <Header
            title="وبسایت شخصی رضا شاه‌نظر"
            logo={<Logo className="h-8 w-8" />}
            className="h-[48px] md:h-[64px]"
          />
          <main id="main-content" className="w-full mx-auto">
            {children}
          </main>
        </CustomThemeProvider>
      </body>
    </html>
  );
}
