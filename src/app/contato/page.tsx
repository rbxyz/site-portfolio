"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { NavBar } from "@/app/_components/nav-bar";
import { Button } from "@/app/_components/ui/button";
import { Mail, MapPin, Phone, Send, Github, Linkedin, Instagram, MessageCircle, Calendar, CheckCircle } from "lucide-react";

const contactInfo = [
  {
    icon: Mail,
    title: "Email",
    value: "ruan@allpines.com.br",
    href: "mailto:ruan@allpines.com.br",
    description: "Respondo em até 24 horas"
  },
  {
    icon: Phone,
    title: "WhatsApp",
    value: "+55 (51) 9 9876-1413",
    href: "https://wa.me/5551998761413",
    description: "Disponível das 8h às 22h"
  },
  {
    icon: MapPin,
    title: "Localização",
    value: "Rio Grande do Sul, Brasil",
    href: "#",
    description: "Trabalho remotamente"
  },
  {
    icon: Calendar,
    title: "Calendário",
    value: "Agendar Reunião",
    href: "#",
    description: "Vamos conversar!"
  }
];

const socialLinks = [
  {
    icon: Github,
    name: "GitHub",
    href: "https://github.com/rbxyz",
  },
  {
    icon: Linkedin,
    name: "LinkedIn",
    href: "https://linkedin.com/in/rbxyz/",
  },
  {
    icon: Instagram,
    name: "Instagram", 
    href: "https://www.instagram.com/rb_rs_/",
  }
];

export default function ContatoPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simular envio do formulário
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsSubmitting(false);
    setIsSubmitted(true);
    
    // Reset form after 3 seconds
    setTimeout(() => {
      setIsSubmitted(false);
      setFormData({ name: "", email: "", subject: "", message: "" });
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-dark-bg text-white">
      <NavBar />
      
      <main className="pt-16">
        {/* Hero Section */}
        <section className="relative py-20 bg-dark-bg">
          <div className="container mx-auto px-4 md:px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center max-w-3xl mx-auto"
            >
              <div className="text-primary-500 font-mono text-sm md:text-base uppercase tracking-wider mb-4">
                CONTACT
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                <span className="text-white">Vamos</span>{" "}
                <span className="text-primary-500">Conversar</span>
              </h1>
              <p className="text-xl text-accent-gray mb-8">
                Tem uma ideia? Precisa de ajuda com um projeto? Ou apenas quer trocar uma ideia sobre tecnologia? 
                Estou sempre disponível para uma boa conversa!
              </p>
              <div className="flex justify-center gap-4">
                {socialLinks.map((social, index) => (
                  <motion.a
                    key={index}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    className="p-3 rounded-full bg-dark-card border border-dark-border backdrop-blur-sm shadow-lg hover:border-primary-500/50 hover:text-primary-500 transition-all duration-300 text-accent-gray"
                  >
                    <social.icon className="h-6 w-6" />
                    <span className="sr-only">{social.name}</span>
                  </motion.a>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* Contact Section */}
        <section className="py-20 bg-dark-bg">
          <div className="container mx-auto px-4 md:px-6">
            <div className="grid lg:grid-cols-2 gap-12">
              {/* Contact Info */}
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
              >
                <div className="text-primary-500 font-mono text-sm md:text-base uppercase tracking-wider mb-4">
                  INFO
                </div>
                <h2 className="text-3xl font-bold mb-8 text-white">
                  Informações de <span className="text-primary-500">Contato</span>
                </h2>
                
                <div className="space-y-6">
                  {contactInfo.map((info, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: index * 0.1 }}
                      viewport={{ once: true }}
                      className="flex items-start space-x-4 p-4 rounded-lg bg-dark-card border border-dark-border hover:border-primary-500/50 transition-all duration-300"
                    >
                      <div className="flex-shrink-0">
                        <div className="w-12 h-12 bg-primary-500/20 border border-primary-500/50 rounded-lg flex items-center justify-center">
                          <info.icon className="h-6 w-6 text-primary-500" />
                        </div>
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold mb-1 text-white">{info.title}</h3>
                        <a
                          href={info.href}
                          target={info.href.startsWith('http') ? '_blank' : '_self'}
                          rel={info.href.startsWith('http') ? 'noopener noreferrer' : ''}
                          className="text-primary-500 hover:text-primary-400 underline font-medium"
                        >
                          {info.value}
                        </a>
                        <p className="text-sm text-accent-gray mt-1">{info.description}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.5 }}
                  viewport={{ once: true }}
                  className="mt-8 p-6 bg-dark-card border border-primary-500/20 rounded-xl"
                >
                  <h3 className="text-lg font-semibold mb-3 flex items-center text-white">
                    <MessageCircle className="h-5 w-5 mr-2 text-primary-500" />
                    Disponibilidade
                  </h3>
                  <p className="text-accent-gray">
                    Atualmente <span className="text-primary-500 font-semibold">disponível</span> para novos projetos 
                    e consultorias. Tempo de resposta médio: <span className="font-semibold text-white">2-4 horas</span> em dias úteis.
                  </p>
                </motion.div>
              </motion.div>

              {/* Contact Form */}
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
              >
                <div className="bg-dark-card border border-dark-border rounded-2xl shadow-xl p-8">
                  <div className="text-primary-500 font-mono text-sm md:text-base uppercase tracking-wider mb-4">
                    MESSAGE
                  </div>
                  <h2 className="text-3xl font-bold mb-8 text-white">
                    Envie uma <span className="text-primary-500">Mensagem</span>
                  </h2>

                  {isSubmitted ? (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="text-center py-12"
                    >
                      <CheckCircle className="h-16 w-16 text-primary-500 mx-auto mb-4" />
                      <h3 className="text-2xl font-bold text-primary-500 mb-2">Mensagem Enviada!</h3>
                      <p className="text-accent-gray">
                        Obrigado pelo contato. Retornarei em breve!
                      </p>
                    </motion.div>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="grid md:grid-cols-2 gap-6">
                        <div>
                          <label htmlFor="name" className="block text-sm font-medium mb-2 text-white">
                            Nome *
                          </label>
                          <input
                            type="text"
                            id="name"
                            name="name"
                            required
                            value={formData.name}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 rounded-lg border border-dark-border bg-dark-surface text-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200 placeholder:text-accent-gray/50"
                            placeholder="Seu nome completo"
                          />
                        </div>
                        <div>
                          <label htmlFor="email" className="block text-sm font-medium mb-2 text-white">
                            Email *
                          </label>
                          <input
                            type="email"
                            id="email"
                            name="email"
                            required
                            value={formData.email}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 rounded-lg border border-dark-border bg-dark-surface text-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200 placeholder:text-accent-gray/50"
                            placeholder="seu@email.com"
                          />
                        </div>
                      </div>
                      
                      <div>
                        <label htmlFor="subject" className="block text-sm font-medium mb-2 text-white">
                          Assunto *
                        </label>
                        <select
                          id="subject"
                          name="subject"
                          required
                          value={formData.subject}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 rounded-lg border border-dark-border bg-dark-surface text-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200"
                        >
                          <option value="">Selecione um assunto</option>
                          <option value="projeto">Novo Projeto</option>
                          <option value="consultoria">Consultoria</option>
                          <option value="freelance">Trabalho Freelance</option>
                          <option value="parcerias">Parcerias</option>
                          <option value="outros">Outros</option>
                        </select>
                      </div>

                      <div>
                        <label htmlFor="message" className="block text-sm font-medium mb-2 text-white">
                          Mensagem *
                        </label>
                        <textarea
                          id="message"
                          name="message"
                          required
                          rows={6}
                          value={formData.message}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 rounded-lg border border-dark-border bg-dark-surface text-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200 resize-vertical placeholder:text-accent-gray/50"
                          placeholder="Conte-me sobre seu projeto ou como posso ajudá-lo..."
                        />
                      </div>

                      <Button
                        type="submit"
                        disabled={isSubmitting}
                        size="lg"
                        className="w-full bg-transparent border-2 border-primary-500 text-white hover:bg-primary-500 hover:text-dark-bg font-semibold py-4 px-8 rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isSubmitting ? (
                          <div className="flex items-center justify-center">
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                            Enviando...
                          </div>
                        ) : (
                          <div className="flex items-center justify-center">
                            <Send className="h-5 w-5 mr-2" />
                            Enviar Mensagem
                          </div>
                        )}
                      </Button>
                    </form>
                  )}
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-20 bg-dark-bg">
          <div className="container mx-auto px-4 md:px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <div className="text-primary-500 font-mono text-sm md:text-base uppercase tracking-wider mb-4">
                FAQ
              </div>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                <span className="text-white">Perguntas</span>{" "}
                <span className="text-primary-500">Frequentes</span>
              </h2>
              <p className="text-lg text-accent-gray">
                Respostas para as dúvidas mais comuns
              </p>
            </motion.div>

            <div className="max-w-3xl mx-auto space-y-6">
              {[
                {
                  question: "Quanto custa um projeto de desenvolvimento web?",
                  answer: "Os valores variam dependendo da complexidade, funcionalidades e prazo. Faço uma análise detalhada de cada projeto para oferecer o melhor custo-benefício."
                },
                {
                  question: "Você constói sistemas pequenos com IA?",
                  answer: "Sim! Faço sistemas pequenos com IA para empresas que precisam de um sistema simples e eficiente."
                },
                {
                  question: "Qual é o prazo médio de entrega?",
                  answer: "Sites simples: 2 - 7 dias. Sistemas complexos: 1-3 meses. Sempre alinhamos prazos realistas no início do projeto."
                },
                {
                  question: "Ofereço suporte pós-entrega?",
                  answer: "Sim! Ofereço 15 dias de suporte gratuito e planos de manutenção mensal para garantir que tudo continue funcionando perfeitamente."
                },
                {
                  question: "Trabalho com projetos de marketing digital?",
                  answer: "Otimizo totalmente seu website para performar da melhor forma possível! Sou especialista em tráfego pago, criação de campanhas e otimização de conversões para diversos nichos."
                },
              ].map((faq, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="bg-dark-card border border-dark-border rounded-lg p-6 hover:border-primary-500/50 transition-all duration-300"
                >
                  <h3 className="text-lg font-semibold mb-3 text-white">{faq.question}</h3>
                  <p className="text-accent-gray">{faq.answer}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
