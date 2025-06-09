"use client";

import type { ReactNode } from "react";

export function Providers({ children }: { children: ReactNode }) {
  // In the future, context providers like ThemeProvider or ReactQueryProvider can go here.
  return <>{children}</>;
}
