import "./globals.css";
import { CustomThemeProvider } from "@/components/theme/theme-provider";
import { IRANYekan } from "@/fonts/local-fonts";
import { cn } from "@/lib/utils";
import { Header } from "@/components/layout/header";
import { SkipLink } from "@/components/layout/skip-link";
import { metadata } from "@/config/metadata";
import { viewport } from "@/config/viewport";
import { Logo } from "@/components/brand/logo";
export { metadata, viewport };

const BODY_BASE_CLASSES = "antialiased bg-background text-foreground";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fa-IR" dir="rtl" suppressHydrationWarning>
      <body className={cn(IRANYekan.className, BODY_BASE_CLASSES)}>
        <CustomThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
          enableColorScheme
        >
          <SkipLink href="#main-content">رفتن به محتوای اصلی</SkipLink>
          <Header title="وبسایت شخصی رضا شاه‌نظر" logo={<Logo className="h-8 w-8" />} className="h-[48px] md:h-[64px]" />
          <main id="main-content" className="w-full mx-auto">
            {children}
          </main>
        </CustomThemeProvider>
      </body>
    </html>
  );
}
