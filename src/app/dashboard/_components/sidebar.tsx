"use client";

import Link from "next/link";
import { signOut } from "next-auth/react";
import { FolderKanban, Newspaper, ArrowLeft, LogOut } from "lucide-react";

export type DashboardTab = "projects" | "blog";

const ITEMS = [
  {
    key: "projects" as const,
    label: "Projetos",
    hint: "Gestão de projetos",
    Icon: FolderKanban,
  },
  {
    key: "blog" as const,
    label: "Blog",
    hint: "Gestão dos posts",
    Icon: Newspaper,
  },
];

/**
 * Navegação lateral do admin. Substitui a NavBar pública: no desktop fica
 * fixa à esquerda, no mobile vira uma faixa horizontal no topo do conteúdo.
 */
export function Sidebar({
  active,
  onChange,
}: {
  active: DashboardTab;
  onChange: (tab: DashboardTab) => void;
}) {
  return (
    <aside className="border-card-border bg-card md:fixed md:inset-y-0 md:left-0 md:z-40 md:flex md:w-60 md:flex-col md:border-r">
      {/* Marca */}
      <div className="border-b border-card-border px-5 py-5">
        <Link
          href="/"
          className="font-mono text-lg font-bold text-primary-500 transition-opacity hover:opacity-80"
        >
          {"< RBXYZ />"}
        </Link>
        <p className="mt-1 font-mono text-[10px] uppercase tracking-[.2em] text-ink-faint">
          Painel admin
        </p>
      </div>

      {/* Navegação */}
      <nav className="flex gap-2 overflow-x-auto p-3 md:flex-1 md:flex-col md:overflow-visible">
        {ITEMS.map(({ key, label, hint, Icon }) => {
          const isActive = active === key;
          return (
            <button
              key={key}
              onClick={() => onChange(key)}
              aria-current={isActive ? "page" : undefined}
              className={`flex flex-shrink-0 items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-colors md:w-full ${
                isActive
                  ? "bg-primary-500/20 text-primary-300"
                  : "text-ink-secondary hover:bg-white/5 hover:text-ink"
              }`}
            >
              <Icon className="h-4 w-4 flex-shrink-0" />
              <span className="min-w-0">
                <span className="block text-sm font-medium">{label}</span>
                <span className="hidden text-xs text-ink-faint md:block">
                  {hint}
                </span>
              </span>
            </button>
          );
        })}
      </nav>

      {/* Rodapé */}
      <div className="flex gap-2 border-card-border px-3 pb-3 md:flex-col md:border-t md:px-3 md:py-4">
        <Link
          href="/"
          className="flex flex-1 items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-ink-secondary transition-colors hover:bg-white/5 hover:text-ink"
        >
          <ArrowLeft className="h-4 w-4 flex-shrink-0" />
          Ver o site
        </Link>
        <button
          onClick={() => void signOut({ callbackUrl: "/" })}
          className="flex flex-1 items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-ink-secondary transition-colors hover:bg-red-500/10 hover:text-red-400"
        >
          <LogOut className="h-4 w-4 flex-shrink-0" />
          Sair
        </button>
      </div>
    </aside>
  );
}
