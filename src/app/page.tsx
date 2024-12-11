"use client";

// import { NavBar } from "@/app/_components/nav-bar"
import { HeroSection } from "@/app/_components/hero"
import { ProjetosSection } from "./_components/project";

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <main>
        <HeroSection />
        <ProjetosSection />
      </main>
    </div>
  )
}
