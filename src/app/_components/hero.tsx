"use client";

import { motion } from "framer-motion";
import { Download, Github, Instagram, Linkedin, Archive } from "lucide-react";
import { Button } from "@/app/_components/ui/button";

export function HeroSection() {
  return (
    <section className="min-h-[calc(100vh-4rem)] flex items-center justify-center py-20">
      <div className="container px-4 md:px-6">
        <div className="grid gap-6 items-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5 }}
            className="flex justify-center"
          >
            <div className="relative w-40 h-40 md:w-60 md:h-60">
              <div className="w-full h-full rounded-full overflow-hidden border-4 border-primary">
                <img
                  alt="Profile picture"
                  className="object-cover"
                  src="/placeholder.svg"
                  style={{
                    aspectRatio: "1/1",
                    width: "100%",
                    height: "100%",
                  }}
                />
              </div>
            </div>
          </motion.div>
          <div className="flex flex-col items-center space-y-4 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl">
                Olá, me chamo Dev
              </h1>
              <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400 mt-4">
                Trabalho com Gestão de Tráfego e Conversão e desenvolvimento front-end, mas possuo conhecimento básico para fullstack. Confira meu currículo abaixo ou acesse meus projetos.
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="flex flex-wrap justify-center gap-4"
            >
              <Button 
                variant="ghost" 
                size="icon" 
                ariaLabel="GitHub" 
                onClick={() => {}}
              >
                <a href="https://github.com" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
                  <Github className="h-5 w-5" />
                </a>
              </Button>
              <Button 
                variant="ghost" 
                size="icon" 
                ariaLabel="Instagram" 
                onClick={() => {}}
              >
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                  <Instagram className="h-5 w-5" />
                </a>
              </Button>
              <Button 
                variant="ghost" 
                size="icon" 
                ariaLabel="LinkedIn" 
                onClick={() => {}}
              >
                <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                  <Linkedin className="h-5 w-5" />
                </a>
              </Button>
              <Button 
                variant="ghost" 
                size="icon" 
                ariaLabel="Download CV" 
                onClick={() => {}}
              >
                <a href="/cv.pdf" download aria-label="Download CV">
                  <Download className="h-5 w-5" />
                </a>
              </Button>
              <Button 
                variant="default" 
                size="default" 
                ariaLabel="Download projeto completo" 
                onClick={() => {}}
              >
                <a href="/portfolio.zip" download aria-label="Download projeto completo" className="flex items-center">
                  <Archive className="h-5 w-5 mr-2" />
                  Baixar Projeto Completo
                </a>
              </Button>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
