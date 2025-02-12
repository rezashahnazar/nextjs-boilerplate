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
  title: "رضا شاه‌نظر | Reza Shahnazar",
  description:
    "وبسایت شخصی رضا شاه‌نظر - متخصص قلب و عروق، مدیر Product Marketing دیجی‌کالا و مهندس نرم‌افزار | Personal website of Reza Shahnazar - Cardiologist, Product Marketing Manager at Digikala, and Software Engineer",
  authors: [
    { name: "Reza Shahnazar", url: "https://github.com/rezashahnazar" },
    { name: "رضا شاه‌نظر", url: "https://github.com/rezashahnazar" },
  ],
  creator: "Reza Shahnazar",
  keywords: [
    "رضا شاه‌نظر",
    "Reza Shahnazar",
    "دیجی‌کالا",
    "Digikala",
    "Product Marketing",
    "پزشک",
    "متخصص قلب",
    "Cardiologist",
    "Software Engineer",
    "مهندس نرم‌افزار",
    "پروداکت مارکتینگ",
  ],
  metadataBase: new URL("https://www.shahnazar.me"),
  openGraph: {
    title: "رضا شاه‌نظر | Reza Shahnazar",
    description:
      "وبسایت شخصی رضا شاه‌نظر - متخصص قلب و عروق، مدیر Product Marketing دیجی‌کالا و مهندس نرم‌افزار | Personal website of Reza Shahnazar - Cardiologist, Product Marketing Manager at Digikala, and Software Engineer",
    type: "website",
    url: "https://www.shahnazar.me",
    siteName: "رضا شاه‌نظر | Reza Shahnazar",
    locale: "fa_IR",
    alternateLocale: "en_US",
    images: [
      {
        url: "https://www.shahnazar.me/opengraph-image",
        width: 1200,
        height: 630,
        alt: "رضا شاه‌نظر | Reza Shahnazar",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "رضا شاه‌نظر | Reza Shahnazar",
    description:
      "وبسایت شخصی رضا شاه‌نظر - متخصص قلب و عروق، مدیر Product Marketing دیجی‌کالا و مهندس نرم‌افزار | Personal website of Reza Shahnazar",
    images: ["https://www.shahnazar.me/opengraph-image"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
  },
  alternates: {
    canonical: "https://www.shahnazar.me",
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
