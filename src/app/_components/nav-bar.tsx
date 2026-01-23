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
      className="rounded-md border border-dark-border bg-dark-card p-2 transition hover:bg-dark-hover text-accent-gray hover:text-primary-500"
      aria-label="Alternar modo claro/escuro"
    >
      {resolvedTheme === "dark" ? (
        <SunIcon className="h-5 w-5" />
      ) : (
        <MoonIcon className="h-5 w-5" />
      )}
    </button>
  );
}

export function NavBar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-dark-bg/80 backdrop-blur-sm border-b border-dark-border">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 md:px-6">
        {/* Logo */}
        <div className="text-xl font-bold font-mono">
          <Link href="/" className="transition hover:opacity-80">
            <span className="text-primary-500">
              {"< RBXYZ />"}
            </span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden items-center space-x-8 md:flex">
          <Link
            href="/"
            className="relative text-accent-gray transition hover:text-primary-500 after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-primary-500 after:transition-all after:duration-300 hover:after:w-full"
          >
            Home
          </Link>
          <Link
            href="/sobre"
            className="relative text-accent-gray transition hover:text-primary-500 after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-primary-500 after:transition-all after:duration-300 hover:after:w-full"
          >
            Bio
          </Link>
          <Link
            href="/pages/projects"
            className="relative text-accent-gray transition hover:text-primary-500 after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-primary-500 after:transition-all after:duration-300 hover:after:w-full"
          >
            Portfolio
          </Link>
          <Link
            href="/contato"
            className="relative text-accent-gray transition hover:text-primary-500 after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-primary-500 after:transition-all after:duration-300 hover:after:w-full"
          >
            Contact
          </Link>
          <Link
            href="https://blog.ruan.allpines.com.br/"
            target="_blank"
            rel="noopener noreferrer"
            className="relative text-accent-gray transition hover:text-primary-500 after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-primary-500 after:transition-all after:duration-300 hover:after:w-full"
          >
            Blog
          </Link>
          <Link
            href="https://ethos-iv.vercel.app/"
            target="_blank"
            rel="noopener noreferrer"
            className="relative text-accent-gray transition hover:text-primary-500 after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-primary-500 after:transition-all after:duration-300 hover:after:w-full"
          >
            Ethos | Gestão de tempo
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
            className="rounded-md p-2 text-accent-gray hover:bg-dark-card transition-colors"
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
        <div className="md:hidden bg-dark-bg/95 backdrop-blur-sm border-t border-dark-border">
          <nav className="flex flex-col space-y-4 p-4">
            <Link
              href="/"
              onClick={() => setIsMenuOpen(false)}
              className="block py-2 text-lg text-accent-gray transition hover:text-primary-500"
            >
              Home
            </Link>
            <Link
              href="/sobre"
              onClick={() => setIsMenuOpen(false)}
              className="block py-2 text-lg text-accent-gray transition hover:text-primary-500"
            >
              Bio
            </Link>
            <Link
              href="/pages/projects"
              onClick={() => setIsMenuOpen(false)}
              className="block py-2 text-lg text-accent-gray transition hover:text-primary-500"
            >
              Portfolio
            </Link>
            <Link
              href="/contato"
              onClick={() => setIsMenuOpen(false)}
              className="block py-2 text-lg text-accent-gray transition hover:text-primary-500"
            >
              Contact
            </Link>
            <Link
              href="https://blog.ruan.allpines.com.br/"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setIsMenuOpen(false)}
              className="block py-2 text-lg text-accent-gray transition hover:text-primary-500"
            >
              Blog
            </Link>
            <Link
              href="https://ethos-theta.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setIsMenuOpen(false)}
              className="block py-2 text-lg text-accent-gray transition hover:text-primary-500"
            >
              Ethos | Gestão de tempo
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
