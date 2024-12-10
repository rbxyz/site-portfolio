"use client";

import * as React from "react";
import { MoonIcon, SunIcon } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/app/_components/ui/button";

export function NavBar() {
  const { setTheme, theme } = useTheme();

  return (
    <div className="border-b">
      <div className="flex h-16 items-center px-4 max-w-7xl mx-auto">
        <div className="ml-auto">
          <Button
            variant="ghost"
            size="icon"
            ariaLabel="Toggle theme"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          >
            {theme === "dark" ? (
              <SunIcon className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            ) : (
              <MoonIcon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
