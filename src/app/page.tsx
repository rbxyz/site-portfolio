"use client";

import { NavBar } from "@/app/_components/nav-bar";
import { HeroSection } from "@/app/_components/hero";
import { AboutSection } from "@/app/_components/about";
import { ProjetosSection } from "@/app/_components/project";

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <NavBar />
      <main>
        <HeroSection />
        <AboutSection />
        <ProjetosSection />
      </main>
    </div>
  );
}
