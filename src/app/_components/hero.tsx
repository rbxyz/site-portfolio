"use client";

import { motion } from "framer-motion";
import { Download, Github, Instagram, Linkedin } from "lucide-react";
import { Button } from "@/app/_components/ui/button";
import Image from "next/image";

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
                <Image
                  src="/Ruan-Foto.jpeg"
                  alt="Descrição da imagem"
                  width={500}
                  height={300}
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
                Hello, bem vindo ao meu portifólio!
              </h1>
              <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400 mt-4">
                Meu nome é Ruan Bueno. Sou um entusiasta de tecnologia e de negócios.
                Trabalho com Gestão de Tráfego e Conversão Paga, e desenvolvimento
                web, mas possuo conhecimento básico para fullstack.
                Confira meu currículo abaixo ou visualize meus projetos.
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
                onClick={() => console.log("GitHub Button Clicked")}
              >
                <a
                  href="https://github.com/rbxyz"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="GitHub"
                >
                  <Github className="h-5 w-5" />
                </a>
              </Button>
              <Button
                variant="ghost"
                size="icon"
                ariaLabel="Instagram"
                onClick={() => console.log("Instagram Button Clicked")}
              >
                <a
                  href="https://www.instagram.com/rb_rs_/"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                >
                  <Instagram className="h-5 w-5" />
                </a>
              </Button>
              <Button
                variant="ghost"
                size="icon"
                ariaLabel="LinkedIn"
                onClick={() => console.log("LinkedIn Button Clicked")}
              >
                <a
                  href="linkedin.com/in/ruan-bueno-68929923a/"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="LinkedIn"
                >
                  <Linkedin className="h-5 w-5" />
                </a>
              </Button>
              <Button
                variant="ghost"
                size="icon"
                ariaLabel="Download CV"
                onClick={() => console.log("Download CV Button Clicked")}
              >
                <a
                  href="/cv.pdf"
                  download
                  aria-label="Download CV"
                >
                  <Download className="h-5 w-5" />
                </a>
              </Button>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
