"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { NavBar } from "@/app/_components/nav-bar";
import { motion } from "framer-motion";
import { ExternalLink, Github, Filter, Search, ArrowRight, Star } from "lucide-react";
import { Button } from "@/app/_components/ui/button";
import { usePreloadProjectImages } from "@/lib/hooks/usePreloadImages";
import { useProgressiveLazyLoading, useLazyLoading } from "@/lib/hooks/useLazyLoading";
import { PrefetchLink, usePrefetch } from "@/lib/components/PrefetchLink";
import { useImageCache } from "@/lib/hooks/useServiceWorker";

// Definindo o tipo do projeto
interface Project {
  id: number;
  title: string;
  description: string;
  longDescription: string;
  imageUrl: string;
  technologies: string[];
  link?: string;
  github?: string;
  type: string;
  featured?: boolean;
  year: string;
}

// Array de projetos
const allProjects: Project[] = [
  {
    id: 1,
    title: "AllProtect",
    description: "Sistema de segurança digital para proteger usuários contra estelionato online.",
    longDescription: "Plataforma completa de segurança digital desenvolvida em Java com Firebase, oferecendo proteção em tempo real contra tentativas de estelionato e fraudes online, com sistema de alertas inteligentes e dashboard administrativo.",
    imageUrl: "/allprotect.png",
    technologies: ["Java", "Firebase", "Javascript", "Spring Boot"],
    link: "",
    type: "Saas",
    featured: true,
    year: "2023",
  },
  {
    id: 2,
    title: "AZap",
    description: "Plataforma de automação de vendas e cobranças pelo WhatsApp.",
    longDescription: "Sistema robusto de automação comercial que integra WhatsApp Business API para gerenciamento de vendas, cobrança automatizada e suporte ao cliente, com dashboard analytics e relatórios em tempo real.",
    imageUrl: "/azap.png",
    technologies: ["ReactJS", "Node.js", "TailwindCSS", "TypeScript", "WhatsApp API"],
    link: "",
    type: "Web",
    featured: true,
    year: "2023",
  },
  {
    id: 3,
    title: "AllPines",
    description: "Website corporativo para empresa de tecnologia.",
    longDescription: "Site institucional moderno desenvolvido com Next.js, apresentando portfólio completo de serviços, sistema de contato integrado e otimização SEO avançada para máxima visibilidade online.",
    imageUrl: "/allpines.png",
    technologies: ["NextJS", "TailwindCSS", "TypeScript", "Framer Motion"],
    link: "https://www.allpines.com.br/",
    type: "Web",
    featured: false,
    year: "2025",
  },
  {
    id: 4,
    title: "LuxWatch", 
    description: "E-commerce especializado em relógios de luxo.",
    longDescription: "Plataforma de e-commerce sofisticada para venda de relógios premium, com catálogo interativo, sistema de filtros avançados, carrinho de compras otimizado e integração com gateways de pagamento.",
    imageUrl: "/luxwatch.png",
    technologies: ["NextJS", "TailwindCSS", "TypeScript", "Stripe"],
    link: "https://watchwebpage.netlify.app/",
    type: "Web",
    featured: false,
    year: "2023",
  },
  {
    id: 5,
    title: "Law and Order",
    description: "Website profissional para escritórios de advocacia.",
    longDescription: "Site institucional para advogados e escritórios jurídicos, com seções dedicadas para áreas de atuação, equipe, casos de sucesso e formulário de contato integrado com sistema de agendamento.",
    imageUrl: "/lawandorder.png",
    technologies: ["ReactJS", "TailwindCSS", "TypeScript", "Emailjs"],
    link: "https://lawandorder-page.netlify.app/",
    type: "Web",
    featured: false,
    year: "2023",
  },
  {
    id: 6,
    title: "Blog Pessoal",
    description: "Blog técnico com sistema de gerenciamento de conteúdo.",
    longDescription: "Blog pessoal desenvolvido com T3 Stack, incluindo sistema de autenticação, painel administrativo, editor de posts com markdown, comentários e sistema de tags para organização de conteúdo.",
    imageUrl: "/blog.png",
    technologies: ["T3 Stack", "NextJS", "Prisma", "tRPC", "TailwindCSS"],
    link: "https://blog.ruan.allpines.com.br/",
    type: "Saas",
    featured: false,
    year: "2025",
  },
  {
    id: 7,
    title: "Fantoni Softwares",
    description: "Site de revenda para empresa de softwares.",
    longDescription: "Portal comercial para revenda de softwares empresariais, com catálogo de produtos, sistema de orçamentos online, área do cliente e integração com CRM para gestão de leads e vendas.",
    imageUrl: "/fantoni-software.png",
    technologies: ["NextJS", "TailwindCSS", "TypeScript", "Prisma"],
    link: "https://fantoni-softwares.vercel.app/",
    type: "Web",
    featured: false,
    year: "2025",
  },
  {
    id: 8,
    title: "MarcaAi | Agendamentos Inteligentes",
    description: "Plataforma Saas para prestadores de serviços.",
    longDescription: "Plataforma Saas para prestadores de serviços que dependem de agendamentos, que integra Google Agenda + Whatsapp + IA Models para fazer o atendimento automático.",
    imageUrl: "/",
    technologies: ["NextJS", "TailwindCSS", "TypeScript", "Drizzle"],
    link: "https://marcaaii.vercel.app/",
    type: "Saas",
    featured: true,
    year: "2025",
  },
  {
    id: 9,
    title: "Laura & Ponto | Eccomerce",
    description: "Eccomerce avançado para artesão.",
    longDescription: "Este projeto é um Eccomerce para uma artesão que havia a necessidade de vender pela internet que pudesse emitir vários relatórios personalizados, soluções e integrações específicas, superando plataformas de template.",
    imageUrl: "",
    technologies: ["NextJS", "TailwindCSS", "TypeScript", "Drizzle"],
    link: "https://laura-e-ponto.vercel.app/",
    type: "Saas",
    featured: true,
    year: "2025",
  },
  {
    id: 10,
    title: "Ethos | Minha Gestão Pessoal",
    description: "Aplicação completa de gestão de projetos.",
    longDescription: "Este projeto é uma aplicação que compõe módulos de gestão de projetos, orçamentos, CRM e precificador por valor/projeto.",
    imageUrl: "",
    technologies: ["NextJS", "TailwindCSS", "TypeScript", "Prisma"],
    link: "https://ethos-theta.vercel.app/",
    type: "Saas",
    featured: true,
    year: "2025",
  },
  {
    id: 11,
    title: "Lumos | Finanças Pessoais",
    description: "Aplicação completa de gestão de finanças pessoais.",
    longDescription: "Este projeto é uma aplicação que compõe módulos de consulta de dados financeiros, contém um sistema de calculadora de renda fixa.",
    imageUrl: "",
    technologies: ["NextJS", "TailwindCSS", "TypeScript", "Prisma"],
    link: "https://lumos-app.vercel.app/",
    type: "Saas",
    featured: true,
    year: "2025",
  }
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      delayChildren: 0.2,
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { y: 30, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.5
    }
  }
};

export default function ProjectsPage() {
  const [selectedType, setSelectedType] = useState<string>("All");
  const [searchTerm, setSearchTerm] = useState<string>("");
  
  // Pré-carregamento de imagens dos projetos
  const { allLoaded: imagesPreloaded, progress: imageProgress } = usePreloadProjectImages(allProjects);
  
  // Lazy loading progressivo para os projetos
  const { visibleCount, sentinelRef, hasMore } = useProgressiveLazyLoading(allProjects.length, {
    immediate: 6, // Carregar 6 projetos imediatamente
    batchSize: 4, // Carregar 4 por vez quando scroll
    rootMargin: '200px' // Começar a carregar 200px antes
  });

  // Hook de prefetch para links
  const { prefetchUrl, prefetchImage } = usePrefetch();
  
  // Hook para cache de imagens via Service Worker
  const { cacheImages, isReady: swReady } = useImageCache();

  // Prefetch automático dos links dos projetos visíveis
  useEffect(() => {
    const visibleProjects = allProjects.slice(0, visibleCount);
    const imageUrls: string[] = [];
    const apiKey = process.env.NEXT_PUBLIC_SCREENSHOT_API_KEY;
    
    visibleProjects.forEach(project => {
      if (project.link) {
        prefetchUrl(project.link);
      }
      // Para projetos com imagens locais
      if (project.imageUrl && project.imageUrl.startsWith('/')) {
        prefetchImage(project.imageUrl);
        imageUrls.push(project.imageUrl);
      }
      // Para projetos sem imagem mas com link (usar screenshot)
      else if (!project.imageUrl && project.link && apiKey) {
        const screenshotUrl = `https://api.screenshotone.com/take?access_key=${apiKey}&url=${encodeURIComponent(project.link)}&viewport_width=1280&viewport_height=720&format=jpeg&image_quality=80&block_ads=true&block_cookie_banners=true&full_page=false&delay=5&timeout=60&response_type=by_format`;
        imageUrls.push(screenshotUrl);
      }

    });
    
    // Cachear imagens via Service Worker se estiver pronto
    if (swReady && imageUrls.length > 0) {
      cacheImages(imageUrls);
    }
  }, [visibleCount, prefetchUrl, prefetchImage, cacheImages, swReady]);

  // Filtrando os projetos com base no tipo selecionado e termo de busca
  const filteredProjects = allProjects
    .filter((project) => selectedType === "All" || project.type === selectedType)
    .filter((project) => 
      project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.technologies.some(tech => tech.toLowerCase().includes(searchTerm.toLowerCase()))
    );

  // Separando projetos em destaque e outros
  const featuredProjects = filteredProjects.filter(project => project.featured);
  const otherProjects = filteredProjects.filter(project => !project.featured);

  // Ordenando os projetos: primeiro os disponíveis, depois os não disponíveis
  const sortedProjects = [...featuredProjects, ...otherProjects].sort((a, b) => {
    if (a.link && !b.link) return -1;
    if (!a.link && b.link) return 1;
    // Adicionando ordenação por ano (mais recente primeiro)
    return parseInt(b.year) - parseInt(a.year);
  });

  // Aplicar lazy loading aos projetos filtrados
  const visibleFilteredProjects = sortedProjects.slice(0, visibleCount);

  const filterButtons = [
    { key: "All", label: "Todos", count: allProjects.length },
    { key: "Web", label: "Web", count: allProjects.filter(p => p.type === "Web").length },
    { key: "Saas", label: "Sistemas", count: allProjects.filter(p => p.type === "Saas").length },
  ];

  return (
    <div className="bg-background text-foreground min-h-screen">
      <NavBar />
      
      {/* Hero Section */}
      <section className="pt-32 pb-20 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-blue-900 dark:to-indigo-900">
        <div className="container mx-auto px-4 md:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-4xl mx-auto"
          >
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Meus Projetos
              </span>
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
              Uma coleção dos meus trabalhos mais impactantes, desenvolvidos com paixão e dedicação para resolver problemas reais
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <div className="flex items-center text-gray-600 dark:text-gray-300">
                <Star className="h-5 w-5 mr-2 text-yellow-500" />
                <span>{allProjects.length}+ projetos concluídos</span>
              </div>
              <div className="flex items-center text-gray-600 dark:text-gray-300">
                <ArrowRight className="h-5 w-5 mr-2 text-green-500" />
                <span>{allProjects.filter(p => p.link).length} projetos online</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12 md:px-6">
        {/* Search and Filter Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-12"
        >
          {/* Search Bar */}
          <div className="relative max-w-md mx-auto mb-8">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar projetos, tecnologias..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            />
          </div>

          {/* Filter Buttons */}
          <div className="flex flex-wrap justify-center gap-3">
            {filterButtons.map((filter) => (
              <motion.button
                key={filter.key}
                onClick={() => setSelectedType(filter.key)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`flex items-center gap-2 px-6 py-3 rounded-full font-medium transition-all duration-300 ${
                  selectedType === filter.key
                    ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg"
                    : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-600"
                }`}
              >
                <Filter className="h-4 w-4" />
                {filter.label}
                <span className={`text-xs px-2 py-1 rounded-full ${
                  selectedType === filter.key
                    ? "bg-white/20 text-white"
                    : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400"
                }`}>
                  {filter.count}
                </span>
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Loading Progress Indicator */}
        {!imagesPreloaded && imageProgress < 100 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mb-8"
          >
            <div className="max-w-md mx-auto">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Carregando projetos...
                </span>
                <span className="text-sm text-blue-600 dark:text-blue-400">
                  {Math.round(imageProgress)}%
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-blue-600 to-purple-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${imageProgress}%` }}
                />
              </div>
            </div>
          </motion.div>
        )}

        {/* Projects Grid */}
        {visibleFilteredProjects.length > 0 ? (
          <>
            {/* Featured Projects */}
            {featuredProjects.length > 0 && searchTerm === "" && selectedType === "All" && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="mb-16"
              >
                <h2 className="text-2xl font-bold mb-8 flex items-center">
                  <Star className="h-6 w-6 mr-2 text-yellow-500" />
                  Projetos em Destaque
                </h2>
                <div className="grid md:grid-cols-2 gap-8">
                  {featuredProjects.slice(0, visibleCount).map((project, _index) => (
                    <ProjectCard key={project.id} project={project} index={_index} featured />
                  ))}
                </div>
              </motion.div>
            )}

            {/* All Projects */}
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="space-y-8"
            >
              <h2 className="text-2xl font-bold">
                {searchTerm ? `Resultados para "${searchTerm}"` : 
                 selectedType === "All" ? "Todos os Projetos" : `Projetos ${selectedType}`}
                <span className="text-lg text-gray-500 ml-2">({sortedProjects.length})</span>
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {visibleFilteredProjects.map((project, _index) => (
                  <ProjectCard key={project.id} project={project} index={_index} />
                ))}
              </div>

              {/* Loading Sentinel para lazy loading progressivo */}
              {hasMore && sortedProjects.length > visibleCount && (
                <div ref={sentinelRef} className="text-center py-8">
                  <div className="inline-flex items-center text-gray-500 dark:text-gray-400">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mr-2"></div>
                    Carregando mais projetos...
                  </div>
                </div>
              )}
            </motion.div>
          </>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-2xl font-bold mb-2">Nenhum projeto encontrado</h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Tente ajustar os filtros ou termo de busca
            </p>
            <Button
              onClick={() => {
                setSearchTerm("");
                setSelectedType("All");
              }}
              variant="outline"
            >
              Limpar Filtros
            </Button>
          </motion.div>
        )}
      </div>
    </div>
  );
}

// Componente ProjectCard
function ProjectCard({ project, index: _index, featured = false }: { project: Project; index: number; featured?: boolean }) {
  const apiKey = process.env.NEXT_PUBLIC_SCREENSHOT_API_KEY;
  const screenshotUrl = (project.link && apiKey)
    ? `https://api.screenshotone.com/take?access_key=${apiKey}&url=${encodeURIComponent(project.link)}&viewport_width=1280&viewport_height=720&format=jpeg&image_quality=80&block_ads=true&block_cookie_banners=true&full_page=false&delay=5&timeout=60&response_type=by_format`
    : project.imageUrl;

  // Lazy loading para o card
  const { elementRef: cardRef, shouldLoad } = useLazyLoading<HTMLDivElement>({
    threshold: 0.1,
    rootMargin: '100px',
    triggerOnce: true
  });

  return (
    <motion.div
      ref={cardRef}
      variants={itemVariants}
      whileHover={{ y: -10 }}
      className={`group relative bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border border-gray-200/50 dark:border-gray-700/50 ${
        featured ? "md:col-span-1" : ""
      }`}
    >
      {/* Featured Badge */}
      {project.featured && (
        <div className="absolute top-4 left-4 z-10 flex items-center gap-1 bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-3 py-1 rounded-full text-sm font-medium">
          <Star className="h-3 w-3" />
          Destaque
        </div>
      )}

      {/* Project Image */}
      <div className={`relative overflow-hidden ${featured ? "h-64" : "h-48"}`}>
        {shouldLoad ? (
          <Image
            src={screenshotUrl}
            alt={project.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-110"
            loading="lazy"
            placeholder="blur"
            blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyejFhCGjqiHPFBILdVBk+SKTNI2h9A7RbScfaSXVGaHzDT5FaRmjoyEjqiNPA=="
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800 animate-pulse flex items-center justify-center">
            <div className="text-gray-400 dark:text-gray-500">
              <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* Year Badge */}
        <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-sm text-white px-2 py-1 rounded text-sm">
          {project.year}
        </div>

        {/* Overlay Buttons */}
        <div className="absolute bottom-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          {project.link && (
            <Button
              size="sm"
              className="bg-white/90 hover:bg-white text-gray-900 rounded-full p-2 shadow-lg"
              asChild
            >
              <PrefetchLink 
                href={project.link} 
                prefetchOnHover={true}
                className="flex items-center justify-center"
              >
                <ExternalLink className="h-4 w-4" />
              </PrefetchLink>
            </Button>
          )}
          {project.github && (
            <Button
              size="sm"
              className="bg-white/90 hover:bg-white text-gray-900 rounded-full p-2 shadow-lg"
              asChild
            >
              <PrefetchLink 
                href={project.github} 
                prefetchOnHover={true}
                className="flex items-center justify-center"
              >
                <Github className="h-4 w-4" />
              </PrefetchLink>
            </Button>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <div className="flex items-start justify-between mb-3">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
            {project.title}
          </h3>
          <div className="flex-shrink-0 ml-2">
            {project.link ? (
              <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse" title="Online" />
            ) : (
              <div className="h-2 w-2 bg-orange-500 rounded-full" title="Em desenvolvimento" />
            )}
          </div>
        </div>

        <p className="text-gray-600 dark:text-gray-300 mb-4 text-sm leading-relaxed">
          {featured ? project.longDescription : project.description}
        </p>

        {/* Technologies */}
        <div className="flex flex-wrap gap-2 mb-4">
          {project.technologies.slice(0, featured ? 5 : 3).map((tech, techIndex) => (
            <span
              key={techIndex}
              className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300 border border-blue-200 dark:border-blue-800"
            >
              {tech}
            </span>
          ))}
          {project.technologies.length > (featured ? 5 : 3) && (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300">
              +{project.technologies.length - (featured ? 5 : 3)}
            </span>
          )}
        </div>

        {/* Action Button */}
        <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
          {project.link ? (
            <Button
              variant="ghost"
              className="w-full group/btn hover:bg-blue-50 dark:hover:bg-blue-900/20"
              asChild
            >
              <PrefetchLink 
                href={project.link} 
                prefetchOnHover={true}
                prefetchOnVisible={true}
                className="flex items-center justify-center gap-2 text-blue-600 dark:text-blue-400 w-full h-full"
              >
                Visualizar Projeto
                <ExternalLink className="h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
              </PrefetchLink>
            </Button>
          ) : (
            <div className="text-center py-2">
              <span className="text-sm text-orange-600 dark:text-orange-400 font-medium">
                🚧 Em desenvolvimento
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Decorative Gradient */}
      <div className="absolute -bottom-2 -right-2 w-24 h-24 bg-gradient-to-br from-blue-400/20 to-purple-600/20 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
    </motion.div>
  );
}
