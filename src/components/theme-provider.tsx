"use client";

import * as React from "react";
import dynamic from "next/dynamic";
import type { ThemeProviderProps } from "next-themes";

const ThemeProvider = dynamic(
  () => import("next-themes").then((mod) => mod.ThemeProvider),
  { ssr: false }
);

export function CustomThemeProvider({
  children,
  ...props
}: ThemeProviderProps) {
  return <ThemeProvider {...props}>{children}</ThemeProvider>;
}
