"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/app/_components/ui/button";
import { CanvasMouseEffect } from "./canvas-mouse-effect";
import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";

function TypingText({ text, className }: { text: string; className?: string }) {
  const [displayedText, setDisplayedText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [charIndex, setCharIndex] = useState(0);

  useEffect(() => {
    const typingSpeed = isDeleting ? 50 : 100; // Mais rápido ao deletar
    const pauseTime = isDeleting ? 500 : 2000; // Pausa após completar

    const timeout = setTimeout(() => {
      if (!isDeleting && charIndex < text.length) {
        // Digitando
        setDisplayedText(text.slice(0, charIndex + 1));
        setCharIndex(charIndex + 1);
      } else if (!isDeleting && charIndex === text.length) {
        // Texto completo, aguardar antes de deletar
        setTimeout(() => setIsDeleting(true), pauseTime);
      } else if (isDeleting && charIndex > 0) {
        // Deletando
        setDisplayedText(text.slice(0, charIndex - 1));
        setCharIndex(charIndex - 1);
      } else if (isDeleting && charIndex === 0) {
        // Texto deletado, começar novamente
        setIsDeleting(false);
      }
    }, typingSpeed);

    return () => clearTimeout(timeout);
  }, [charIndex, isDeleting, text]);

  return (
    <span className={className}>
      {displayedText}
      <span className="animate-pulse">|</span>
    </span>
  );
}

export function HeroSection() {
  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden bg-dark-bg">
      {/* Canvas Mouse Effect */}
      <CanvasMouseEffect />

      {/* Subtle green glow in top-left corner */}
      <div className="pointer-events-none absolute left-0 top-0 h-96 w-96 rounded-full bg-primary-500/20 blur-3xl" />

      <div className="container relative z-10 max-w-7xl px-4 sm:px-6 md:px-8">
        <div className="grid items-center gap-8 md:gap-12 lg:grid-cols-2">
          {/* Coluna do texto - à esquerda */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="space-y-6 text-center md:space-y-8 lg:text-left"
          >
            {/* Tagline */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="font-mono text-xs uppercase tracking-wider text-primary-500 sm:text-sm md:text-base"
            >
              Ruan Bueno - dev & café & automação e IA
            </motion.div>

            {/* Main Title */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-3xl font-bold leading-tight sm:text-4xl md:text-5xl lg:text-7xl xl:text-8xl"
            >
              <span className="text-white">Dev. &</span>
              <br />
              <span className="text-primary-500">
                <TypingText text="Criador de soluções digitais" />
              </span>
            </motion.h1>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="mx-auto max-w-2xl text-base leading-relaxed text-accent-gray sm:text-lg md:text-xl lg:mx-0"
            >
              Bem-vindo ao meu portifolio — hub de projetos para empresas
              grandes, médias ou pequenas.
              <span className="text-primary-500">....</span> Facilidade para
              todos, não importa o seu tamanho.
            </motion.p>

            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="flex flex-col flex-wrap justify-center gap-3 sm:flex-row sm:gap-4 lg:justify-start"
            >
              <Link href="/pages/projects" className="w-full sm:w-auto">
                <Button className="group flex w-full items-center justify-center gap-2 rounded-lg border-2 border-primary-500 bg-transparent px-6 py-2.5 font-semibold text-white transition-all duration-300 hover:bg-primary-500 hover:text-dark-bg sm:w-auto sm:px-8 sm:py-3">
                  explore projetos
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>

              <Link href="/sobre" className="w-full sm:w-auto">
                <Button
                  variant="outline"
                  className="w-full rounded-lg border border-dark-border bg-transparent px-6 py-2.5 font-semibold text-accent-gray transition-all duration-300 hover:border-primary-500/50 hover:text-primary-500 sm:w-auto sm:px-8 sm:py-3"
                >
                  sobre mim
                </Button>
              </Link>
            </motion.div>
          </motion.div>

          {/* Coluna da imagem - à direita */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
            className="order-first flex justify-center lg:order-last lg:justify-end"
          >
            <div className="relative">
              {/* Efeito de glow around da imagem */}
              <div className="absolute -inset-2 animate-pulse rounded-full bg-primary-500/30 opacity-75 blur-2xl sm:-inset-4" />
              <div className="relative h-48 w-48 sm:h-64 sm:w-64 md:h-80 md:w-80 lg:h-96 lg:w-96">
                <div className="h-full w-full overflow-hidden rounded-full border-2 border-primary-500/50 shadow-2xl backdrop-blur-sm sm:border-4">
                  <Image
                    src="/ruan.PNG"
                    alt="Ruan Bueno - Developer"
                    width={500}
                    height={500}
                    className="h-full w-full object-cover"
                    priority
                  />
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
