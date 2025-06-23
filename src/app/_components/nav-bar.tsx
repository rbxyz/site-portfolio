"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { SunIcon, MoonIcon, Menu, X } from "lucide-react";
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
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-b border-gray-200/50 dark:border-gray-700/50">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 md:px-6">
        {/* Logo */}
        <div className="text-2xl font-bold">
          <Link href="/" className="transition hover:opacity-80">
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              {"< Ruan Bueno />"}
            </span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden items-center space-x-8 md:flex">
          <Link
            href="/"
            className="relative transition hover:text-blue-500 after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-gradient-to-r after:from-blue-600 after:to-purple-600 after:transition-all after:duration-300 hover:after:w-full"
          >
            Início
          </Link>
          <Link
            href="/sobre"
            className="relative transition hover:text-blue-500 after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-gradient-to-r after:from-blue-600 after:to-purple-600 after:transition-all after:duration-300 hover:after:w-full"
          >
            Sobre
          </Link>
          <Link
            href="/pages/projects"
            className="relative transition hover:text-blue-500 after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-gradient-to-r after:from-blue-600 after:to-purple-600 after:transition-all after:duration-300 hover:after:w-full"
          >
            Projetos
          </Link>
          <Link
            href="/contato"
            className="relative transition hover:text-blue-500 after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-gradient-to-r after:from-blue-600 after:to-purple-600 after:transition-all after:duration-300 hover:after:w-full"
          >
            Contato
          </Link>
          <Link
            href="https://blog.ruan.allpines.com.br/"
            target="_blank"
            rel="noopener noreferrer"
            className="relative transition hover:text-blue-500 after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-gradient-to-r after:from-blue-600 after:to-purple-600 after:transition-all after:duration-300 hover:after:w-full"
          >
            Blog
          </Link>
          <Link
            href="https://ethos-hoxiuvxzf-rbxyzs-projects.vercel.app/"
            target="_blank"
            rel="noopener noreferrer"
            className="relative transition hover:text-blue-500 after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-gradient-to-r after:from-blue-600 after:to-purple-600 after:transition-all after:duration-300 hover:after:w-full"
          >
            Ethos | Gestão de Horas
          </Link>
        </nav>

        {/* Desktop Theme Switcher */}
        <div className="hidden md:flex items-center space-x-4">
          <ThemeSwitcher />
        </div>

        {/* Mobile Menu Button */}
        <div className="flex items-center space-x-4 md:hidden">
          <ThemeSwitcher />
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="rounded-md p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm border-t border-gray-200/50 dark:border-gray-700/50">
          <nav className="flex flex-col space-y-4 p-4">
            <Link
              href="/"
              onClick={() => setIsMenuOpen(false)}
              className="block py-2 text-lg transition hover:text-blue-500"
            >
              Início
            </Link>
            <Link
              href="/sobre"
              onClick={() => setIsMenuOpen(false)}
              className="block py-2 text-lg transition hover:text-blue-500"
            >
              Sobre
            </Link>
            <Link
              href="/pages/projects"
              onClick={() => setIsMenuOpen(false)}
              className="block py-2 text-lg transition hover:text-blue-500"
            >
              Projetos
            </Link>
            <Link
              href="/contato"
              onClick={() => setIsMenuOpen(false)}
              className="block py-2 text-lg transition hover:text-blue-500"
            >
              Contato
            </Link>
            <Link
              href="https://blog.ruanbueno.cloud/"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setIsMenuOpen(false)}
              className="block py-2 text-lg transition hover:text-blue-500"
            >
              Blog
            </Link>
            <Link
              href="https://ethos.allpines.com.br"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setIsMenuOpen(false)}
              className="block py-2 text-lg transition hover:text-blue-500"
            >
              Ethos
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
