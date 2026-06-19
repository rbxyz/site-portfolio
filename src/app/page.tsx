"use client";

import { Preloader } from "@/app/_components/portfolio/preloader";
import { Hero } from "@/app/_components/portfolio/hero";
import { Sobre } from "@/app/_components/portfolio/sobre";
import { Projetos } from "@/app/_components/portfolio/projetos";
import { FooterCta } from "@/app/_components/portfolio/footer-cta";
import { usePortfolioEffects } from "@/app/_components/portfolio/use-portfolio-effects";
import { C } from "@/app/_components/portfolio/tokens";

export default function Home() {
  usePortfolioEffects();

  return (
    <div style={{ background: C.bg, color: C.text }}>
      <Preloader />
      <main>
        <Hero />
        <Sobre />
        <Projetos />
        <FooterCta />
      </main>
    </div>
  );
}
