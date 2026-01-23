"use client";

import { motion } from "framer-motion";
import { Code, TrendingUp, Users, Zap, Award, Heart } from "lucide-react";
import { Button } from "@/app/_components/ui/button";
import Link from "next/link";

const features = [
  {
    icon: Code,
    title: "Desenvolvimento Full-Stack",
    description: "Criação de aplicações web completas, desde o frontend até o backend, com as tecnologias mais modernas do mercado.",
  },
  {
    icon: TrendingUp,
    title: "Growth & Tráfego Pago",
    description: "Estratégias de crescimento digital e campanhas de tráfego pago otimizadas para maximizar ROI e conversões.",
  },
  {
    icon: Users,
    title: "Experiência do Usuário",
    description: "Design centrado no usuário com foco em usabilidade, acessibilidade e experiências digitais memoráveis.",
  },
  {
    icon: Zap,
    title: "IA & Automação",
    description: "Sistemas completos com IA para empresas que precisam soluções integrados.",
  },
];

// Calcular anos de experiência dinamicamente
const startYear = 2022;
const currentYear = new Date().getFullYear();
const yearsOfExperience = currentYear - startYear;

const stats = [
  { number: "20+", label: "Projetos Entregues", icon: Award },
  { number: `${yearsOfExperience}+`, label: "Anos de Experiência", icon: Code },
  { number: "7+", label: "Clientes Satisfeitos", icon: Heart },
  { number: "100%", label: "Projetos no Prazo", icon: Zap },
];

export function AboutSection() {
  return (
    <section id="about" className="py-16 sm:py-20 md:py-24 bg-dark-bg relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-grid-white/[0.02]" />
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] sm:w-[500px] md:w-[600px] h-[400px] sm:h-[500px] md:h-[600px] bg-primary-500/10 rounded-full blur-3xl" />
      
      <div className="container mx-auto px-4 sm:px-6 md:px-8 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12 sm:mb-16"
        >
          <div className="text-primary-500 font-mono text-xs sm:text-sm md:text-base uppercase tracking-wider mb-3 sm:mb-4">
            ABOUT
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6">
            <span className="text-white">Sobre</span>{" "}
            <span className="text-primary-500">Mim</span>
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-accent-gray max-w-3xl mx-auto leading-relaxed px-2">
            Sou um desenvolvedor full-stack apaixonado por criar soluções digitais que fazem a diferença. 
            Combino expertise técnica com visão estratégica de negócios para entregar resultados excepcionais.
          </p>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 md:gap-8 mb-12 sm:mb-16 md:mb-20"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="text-center group"
            >
              <div className="bg-dark-card border border-dark-border rounded-xl sm:rounded-2xl p-4 sm:p-5 md:p-6 mb-3 sm:mb-4 group-hover:border-primary-500/50 transition-all duration-300">
                <stat.icon className="h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8 text-primary-500 mx-auto mb-2 sm:mb-3" />
                <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-1 sm:mb-2">
                  {stat.number}
                </div>
                <div className="text-xs sm:text-sm text-accent-gray font-medium px-1">
                  {stat.label}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Features Grid */}
        <div className="grid sm:grid-cols-2 gap-6 sm:gap-8 mb-12 sm:mb-16">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="group bg-dark-card border border-dark-border rounded-xl sm:rounded-2xl p-5 sm:p-6 md:p-8 hover:border-primary-500/50 transition-all duration-300"
            >
              <div className="flex items-start space-x-3 sm:space-x-4">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary-500/20 border border-primary-500/50 rounded-lg sm:rounded-xl flex items-center justify-center group-hover:bg-primary-500/30 group-hover:scale-110 transition-all duration-300">
                    <feature.icon className="h-5 w-5 sm:h-6 sm:w-6 text-primary-500" />
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-lg sm:text-xl font-bold text-white mb-2 sm:mb-3 group-hover:text-primary-500 transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-sm sm:text-base text-accent-gray leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="text-center bg-dark-card border border-dark-border rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-12"
        >
          <h3 className="text-2xl sm:text-3xl font-bold text-white mb-3 sm:mb-4">
            Pronto para transformar sua ideia em realidade?
          </h3>
          <p className="text-base sm:text-lg text-accent-gray mb-6 sm:mb-8 max-w-2xl mx-auto px-2">
            Vamos conversar sobre seu próximo projeto e descobrir como posso ajudar a alcançar seus objetivos digitais.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
            <Button 
              size="lg" 
              className="w-full sm:w-auto bg-transparent border-2 border-primary-500 text-white hover:bg-primary-500 hover:text-dark-bg px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-semibold transition-all duration-300"
              asChild
            >
              <Link href="/contato">
                Vamos Conversar
              </Link>
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="w-full sm:w-auto bg-transparent border border-dark-border text-accent-gray hover:border-primary-500/50 hover:text-primary-500 px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-semibold transition-all duration-300"
              asChild
            >
              <Link href="/sobre">
                Saiba Mais
              </Link>
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
