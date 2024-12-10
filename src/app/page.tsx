"use client";

import { NavBar } from "@/app/_components/nav-bar"
import { HeroSection } from "@/app/_components/hero"

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <NavBar />
      <main>
        <HeroSection />
      </main>
    </div>
  )
}
