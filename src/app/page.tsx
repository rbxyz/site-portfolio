import { Hero } from "@/app/_components/portfolio/hero";
import { Sobre } from "@/app/_components/portfolio/sobre";
import { Projetos } from "@/app/_components/portfolio/projetos";
import { UltimoPost } from "@/app/_components/portfolio/ultimo-post";
import { Eventos } from "@/app/_components/portfolio/eventos";
import { FooterCta } from "@/app/_components/portfolio/footer-cta";
import { PortfolioEffects } from "@/app/_components/portfolio/use-portfolio-effects";
import { C } from "@/app/_components/portfolio/tokens";
import { getLatestPost } from "@/server/blog";
import { getEventos } from "@/server/eventos";

// Re-fetch the latest blog post at most every 10 minutes. Event changes made
// in the dashboard revalidate this page right away.
export const revalidate = 600;

export default async function Home() {
  const [latestPost, eventos] = await Promise.all([getLatestPost(), getEventos()]);

  return (
    <div style={{ background: C.bg, color: C.text }}>
      <PortfolioEffects />
      <main>
        <Hero />
        <Sobre />
        <Projetos />
        {latestPost && <UltimoPost post={latestPost} />}
        <Eventos eventos={eventos} />
        <FooterCta />
      </main>
    </div>
  );
}
