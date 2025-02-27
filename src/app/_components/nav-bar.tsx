"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { SunIcon, MoonIcon } from "lucide-react";
import Link from "next/link";

export function ThemeSwitcher() {
  const { setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Garante que o componente só renderize no lado do cliente
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <button
      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
      className="rounded-md border border-gray-300 bg-gray-100 p-2 transition hover:bg-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:hover:bg-gray-600"
      aria-label="Alternar modo claro/escuro"
    >
      {resolvedTheme === "dark" ? (
        <SunIcon className="h-5 w-5 text-yellow-400" />
      ) : (
        <MoonIcon className="h-5 w-5 text-gray-800" />
      )}
    </button>
  );
}

export function NavBar() {
  return (
    <header className="bg-background text-foreground border-b">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 md:px-6">
        {/* Logo */}
        <div className="text-2xl font-bold">
          <Link href="/" className="transition hover:opacity-80">
            {"< Ruan Bueno />"}
          </Link>
        </div>

        {/* Links de Navegação */}
        <nav className="hidden items-center space-x-6 md:flex">
          <Link
            href="https://blog.ruanbueno.cloud/"
            className="transition hover:text-blue-500"
          >
            Blog
          </Link>
          <Link
            href="/pages/projects"
            className="transition hover:text-blue-500"
          >
            Projetos
          </Link>
          <a href="#about" className="transition hover:text-blue-500">
            Sobre
          </a>
          <a href="#contact" className="transition hover:text-blue-500">
            Contato
          </a>
        </nav>

        {/* Botão de alternância de tema */}
        <div className="flex items-center space-x-4">
          <ThemeSwitcher />
        </div>
      </div>
    </header>
  );
}
