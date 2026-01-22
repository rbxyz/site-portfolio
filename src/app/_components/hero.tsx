"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/app/_components/ui/button";
import { CanvasMouseEffect } from "./canvas-mouse-effect";
import Link from "next/link";
import Image from "next/image";

export function HeroSection() {
  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden bg-dark-bg">
      {/* Canvas Mouse Effect */}
      <CanvasMouseEffect />

      {/* Subtle green glow in top-left corner */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-primary-500/20 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 container px-4 md:px-6 max-w-7xl">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          {/* Coluna do texto - à esquerda */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="space-y-8"
          >
            {/* Tagline */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-primary-500 font-mono text-sm md:text-base uppercase tracking-wider"
            >
              Ruan Bueno - dev & café & automação e IA
            </motion.div>

            {/* Main Title */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-5xl md:text-7xl lg:text-8xl font-bold leading-tight"
            >
              <span className="text-white">Dev. &</span>
              <br />
              <span className="text-primary-500">Criador de soluções digitais</span>
            </motion.h1>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="text-accent-gray text-lg md:text-xl max-w-2xl leading-relaxed"
            >
              Bem-vindo ao meu portifolio — hub de projetos para empresas grandes, médias ou pequenas.
              <span className="text-primary-500">....</span> Facilidade para todos, não importa o seu tamanho.
            </motion.p>

            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="flex flex-wrap gap-4"
            >
              <Link href="/pages/projects">
                <Button className="group bg-transparent border-2 border-primary-500 text-white hover:bg-primary-500 hover:text-dark-bg px-8 py-3 rounded-lg font-semibold transition-all duration-300 flex items-center gap-2">
                  explore projetos
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>

              <Link href="/sobre">
                <Button
                  variant="outline"
                  className="bg-transparent border border-dark-border text-accent-gray hover:border-primary-500/50 hover:text-primary-500 px-8 py-3 rounded-lg font-semibold transition-all duration-300"
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
            className="flex justify-center lg:justify-end"
          >
            <div className="relative">
              {/* Efeito de glow around da imagem */}
              <div className="absolute -inset-4 bg-primary-500/30 rounded-full blur-2xl opacity-75 animate-pulse" />
              <div className="relative h-64 w-64 md:h-80 md:w-80 lg:h-96 lg:w-96">
                <div className="h-full w-full overflow-hidden rounded-full border-4 border-primary-500/50 backdrop-blur-sm shadow-2xl">
                  <Image
                    src="/Foto_Perfil.jpg"
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
