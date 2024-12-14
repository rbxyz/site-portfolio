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
      className="p-2 rounded-md border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition"
      aria-label="Alternar modo claro/escuro"
    >
      {resolvedTheme === "dark" ? (
        <SunIcon className="w-5 h-5 text-yellow-400" />
      ) : (
        <MoonIcon className="w-5 h-5 text-gray-800" />
      )}
    </button>
  );
}

export function NavBar() {
  return (
    <header className="border-b bg-background text-foreground">
      <div className="flex items-center justify-between h-16 px-4 md:px-6 max-w-7xl mx-auto">
        {/* Logo */}
        <div className="text-2xl font-bold">
        <Link href="/" className="hover:opacity-80 transition">
          {"< Ruan Bueno />"}
        </Link>
        </div>

        {/* Links de Navegação */}
        <nav className="hidden md:flex items-center space-x-6">
        <Link href="/pages/projects" className="hover:text-blue-500 transition">
          Projetos
        </Link>
          <a href="#about" className="hover:text-blue-500 transition">
            Sobre
          </a>
          <a href="#contact" className="hover:text-blue-500 transition">
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
