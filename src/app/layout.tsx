import { type ReactNode } from "react";
import "./globals.css";
import { CustomThemeProvider } from "@/components/theme/theme-provider";
import { IRANYekan } from "@/fonts/local-fonts";
import { cn } from "@/lib/utils";
import { Header } from "@/components/layout/header";
import { SkipLink } from "@/components/layout/skip-link";
import { metadata } from "@/config/metadata";
import { viewport } from "@/config/viewport";

export { metadata, viewport };

const BODY_BASE_CLASSES = "antialiased bg-background text-foreground";

const THEME_PROVIDER_PROPS = {
  attribute: "class",
  defaultTheme: "system",
  enableSystem: true,
  disableTransitionOnChange: true,
  enableColorScheme: true,
} as const;

interface RootLayoutProps {
  children: ReactNode;
}

export default function RootLayout({ children }: Readonly<RootLayoutProps>) {
  return (
    <html lang="fa-IR" dir="rtl" suppressHydrationWarning>
      <body className={cn(IRANYekan.className, BODY_BASE_CLASSES)}>
        <CustomThemeProvider {...THEME_PROVIDER_PROPS}>
          <SkipLink href="#main-content">رفتن به محتوای اصلی</SkipLink>
          <Header className="h-[48px] md:h-[64px]" />
          <main id="main-content" className="w-full mx-auto">
            {children}
          </main>
        </CustomThemeProvider>
      </body>
    </html>
  );
}
