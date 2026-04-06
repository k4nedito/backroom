"use client";

import { useTheme } from "next-themes";
import { Sun, Moon } from "@phosphor-icons/react";

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();

  return (
    <button
      type="button"
      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
      className="flex items-center justify-center size-8 rounded-sm text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
      aria-label="Toggle theme"
    >
      <Sun className="size-3.5 hidden dark:block" />
      <Moon className="size-3.5 block dark:hidden" />
    </button>
  );
}
