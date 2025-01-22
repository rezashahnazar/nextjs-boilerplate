import type { Metadata } from "next";
import "./globals.css";
import { CustomThemeProvider } from "@/components/theme-provider";
import { IRANYekan } from "@/fonts/local-fonts";
import { cn } from "@/lib/utils";
import { Header } from "@/components/header";

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
          "min-h-screen antialiased bg-background text-foreground"
        )}
      >
        <CustomThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {/* Skip to main content link for keyboard users */}
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:fixed focus:z-50 focus:p-4 focus:bg-background focus:text-foreground"
          >
            رفتن به محتوای اصلی
          </a>
          <Header />
          <main id="main-content" className="container mx-auto px-4 py-8">
            {children}
          </main>
          <footer className="border-t bg-background/95 py-6 text-center text-sm text-muted-foreground">
            <div className="container">
              © {new Date().getFullYear()} - ساخته شده با ❤️
            </div>
          </footer>
        </CustomThemeProvider>
      </body>
    </html>
  );
}
