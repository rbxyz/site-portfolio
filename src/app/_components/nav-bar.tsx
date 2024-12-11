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
        </div>
      </div>
    </div>
  );
}
