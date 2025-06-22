"use client";

import { motion } from "framer-motion";
import { Download, Github, Instagram, Linkedin, ArrowDown } from "lucide-react";
import { Button } from "@/app/_components/ui/button";
import Image from "next/image";

export function HeroSection() {
  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden">
      {/* Background gradients e efeitos */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-blue-900 dark:to-indigo-900"></div>
      <div className="absolute inset-0 bg-grid-black/[0.02] dark:bg-grid-white/[0.02]"></div>
      
      {/* Floating elements para efeito visual */}
      <div className="absolute left-10 top-20 h-20 w-20 rounded-full bg-blue-200/20 blur-xl animate-pulse"></div>
      <div className="absolute right-10 top-40 h-32 w-32 rounded-full bg-purple-200/20 blur-xl animate-pulse delay-1000"></div>
      <div className="absolute bottom-20 left-1/4 h-24 w-24 rounded-full bg-indigo-200/20 blur-xl animate-pulse delay-500"></div>

      <div className="relative z-10 container px-4 md:px-6">
        <div className="grid items-center gap-8 lg:grid-cols-2">
          {/* Coluna da imagem */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="flex justify-center lg:justify-end order-2 lg:order-1"
          >
            <div className="relative">
              {/* Efeito de glow around da imagem */}
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-400 to-purple-600 rounded-full blur opacity-75 animate-pulse"></div>
              <div className="relative h-48 w-48 md:h-64 md:w-64 lg:h-80 lg:w-80">
                <div className="h-full w-full overflow-hidden rounded-full border-4 border-white/20 backdrop-blur-sm shadow-2xl">
                  <Image
                    src="/Foto_Perfil.jpg"
                    alt="Ruan Bueno - Dev. e Especialista em Tráfego"
                    width={500}
                    height={500}
                    className="h-full w-full object-cover"
                    priority
                  />
                </div>
              </div>
              {/* Floating badges */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1, duration: 0.5 }}
                className="absolute -top-4 -right-4 bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-medium shadow-lg"
              >
                ✨ Disponível
              </motion.div>
            </div>
          </motion.div>

          {/* Coluna do texto */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
            className="flex flex-col space-y-6 text-center lg:text-left order-1 lg:order-2"
          >
            <div className="space-y-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="inline-block"
              >
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent font-semibold text-sm md:text-base">
                  👋 Olá, eu sou o Ruan
                </span>
              </motion.div>
              
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight"
              >
                <span className="bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                  Dev. &
                </span>
                <br />
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Growth Hacker
                </span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.8 }}
                className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-lg"
              >
                Especialista em <span className="font-semibold text-blue-600 dark:text-blue-400">desenvolvimento web</span> e{" "}
                <span className="font-semibold text-purple-600 dark:text-purple-400">gestão de tráfego pago</span>. 
                Transformo ideias em soluções digitais que geram resultados.
              </motion.p>
            </div>

            {/* Action buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1 }}
              className="flex flex-wrap gap-4 justify-center lg:justify-start"
            >
              <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 rounded-full font-semibold shadow-lg hover:shadow-xl transition-all duration-300">
                <a href="#contact" className="flex items-center gap-2">
                  Vamos Conversar
                  <ArrowDown className="h-4 w-4" />
                </a>
              </Button>
              
              <Button 
                variant="outline" 
                className="border-2 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 px-8 py-3 rounded-full font-semibold transition-all duration-300"
              >
                <a href="/cv.pdf" download className="flex items-center gap-2">
                  <Download className="h-4 w-4" />
                  Download CV
                </a>
              </Button>
            </motion.div>

            {/* Social links */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.2 }}
              className="flex gap-4 justify-center lg:justify-start"
            >
              {[
                { href: "https://github.com/rbxyz", icon: Github, label: "GitHub" },
                { href: "https://linkedin.com/in/rbxyz/", icon: Linkedin, label: "LinkedIn" },
                { href: "https://www.instagram.com/rb_rs_/", icon: Instagram, label: "Instagram" }
              ].map(({ href, icon: Icon, label }) => (
                <motion.a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className="p-3 rounded-full bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 group"
                >
                  <Icon className="h-5 w-5 text-gray-600 dark:text-gray-300 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors" />
                  <span className="sr-only">{label}</span>
                </motion.a>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 1.5, repeat: Infinity, repeatType: "reverse" }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
      >
        <div className="flex flex-col items-center gap-2 text-gray-400 dark:text-gray-500">
          <span className="text-sm">Role para baixo</span>
          <ArrowDown className="h-4 w-4" />
        </div>
      </motion.div>
    </section>
  );
}
