import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // Limpar dados existentes
  await prisma.project.deleteMany();
  await prisma.account.deleteMany();
  await prisma.session.deleteMany();
  await prisma.user.deleteMany();

  // Criar usuário de teste com senha hasheada
  const defaultPassword = "admin123"; // Senha padrão - altere em produção!
  const hashedPassword = await bcrypt.hash(defaultPassword, 10);

  const testUser = await prisma.user.upsert({
    where: { email: "admin@example.com" },
    update: {
      password: hashedPassword,
    },
    create: {
      email: "admin@example.com",
      name: "Admin User",
      emailVerified: new Date(),
      image: null,
      password: hashedPassword,
    },
  });

  console.log(`✅ Created/Updated test user: ${testUser.email}`);
  console.log(`   User ID: ${testUser.id}`);
  console.log(`   📧 Email: admin@example.com`);
  console.log(`   🔑 Senha: ${defaultPassword}`);
  console.log(`   ⚠️  IMPORTANTE: Altere a senha padrão em produção!`);

  // Criar projetos
  const projects = [
    {
      title: "AllProtect",
      description: "Sistema de segurança digital avançado para proteger usuários contra estelionato online com detecção inteligente de ameaças.",
      longDescription: "Plataforma completa de segurança digital desenvolvida em Java com Firebase, oferecendo proteção em tempo real contra tentativas de estelionato e fraudes online, com sistema de alertas inteligentes e dashboard administrativo.",
      imageUrl: "/allprotect.png",
      technologies: JSON.stringify(["Java", "Firebase", "Javascript", "Spring Boot"]),
      link: null,
      github: null,
      type: "Saas",
      featured: true,
      year: "2023",
      status: "shipped",
      stars: 0,
      forks: 0,
    },
    {
      title: "AZap",
      description: "Plataforma completa de automação de vendas e cobranças pelo WhatsApp com dashboard analítico em tempo real.",
      longDescription: "Sistema robusto de automação comercial que integra WhatsApp Business API para gerenciamento de vendas, cobrança automatizada e suporte ao cliente, com dashboard analytics e relatórios em tempo real.",
      imageUrl: "/azap.png",
      technologies: JSON.stringify(["ReactJS", "TailwindCSS", "TypeScript", "WhatsApp API"]),
      link: null,
      github: null,
      type: "Web",
      featured: false,
      year: "2023",
      status: "shipped",
      stars: 0,
      forks: 0,
    },
    {
      title: "AllPines",
      description: "Website corporativo moderno para empresa de tecnologia com portfólio de projetos e serviços integrados.",
      longDescription: "Site institucional moderno desenvolvido com Next.js, apresentando portfólio completo de serviços, sistema de contato integrado e otimização SEO avançada para máxima visibilidade online.",
      imageUrl: "/allpines.png",
      technologies: JSON.stringify(["NextJS", "TailwindCSS", "TypeScript", "Framer Motion"]),
      link: "https://www.allpines.com.br/",
      github: null,
      type: "Web",
      featured: false,
      year: "2025",
      status: "shipped",
      stars: 0,
      forks: 0,
    },
    {
      title: "LuxWatch",
      description: "E-commerce especializado em relógios de luxo.",
      longDescription: "Plataforma de e-commerce sofisticada para venda de relógios premium, com catálogo interativo, sistema de filtros avançados, carrinho de compras otimizado e integração com gateways de pagamento.",
      imageUrl: "/luxwatch.png",
      technologies: JSON.stringify(["NextJS", "TailwindCSS", "TypeScript", "Stripe"]),
      link: "https://watchwebpage.netlify.app/",
      github: null,
      type: "Web",
      featured: false,
      year: "2023",
      status: "shipped",
      stars: 0,
      forks: 0,
    },
    {
      title: "Law and Order",
      description: "Website profissional para escritórios de advocacia.",
      longDescription: "Site institucional para advogados e escritórios jurídicos, com seções dedicadas para áreas de atuação, equipe, casos de sucesso e formulário de contato integrado com sistema de agendamento.",
      imageUrl: "/lawandorder.png",
      technologies: JSON.stringify(["ReactJS", "TailwindCSS", "TypeScript", "Emailjs"]),
      link: "https://lawandorder-page.netlify.app/",
      github: null,
      type: "Web",
      featured: false,
      year: "2023",
      status: "shipped",
      stars: 0,
      forks: 0,
    },
    {
      title: "Blog Pessoal",
      description: "Blog técnico com sistema de gerenciamento de conteúdo.",
      longDescription: "Blog pessoal desenvolvido com T3 Stack, incluindo sistema de autenticação, painel administrativo, editor de posts com markdown, comentários e sistema de tags para organização de conteúdo.",
      imageUrl: "/blog.png",
      technologies: JSON.stringify(["T3 Stack", "NextJS", "Prisma", "tRPC", "TailwindCSS"]),
      link: "https://blog.ruan.allpines.com.br/",
      github: null,
      type: "Saas",
      featured: false,
      year: "2025",
      status: "shipped",
      stars: 0,
      forks: 0,
    },
    {
      title: "Fantoni Softwares",
      description: "Site de revenda para empresa de softwares.",
      longDescription: "Portal comercial para revenda de softwares empresariais, com catálogo de produtos, sistema de orçamentos online, área do cliente e integração com CRM para gestão de leads e vendas.",
      imageUrl: "/fantoni-software.png",
      technologies: JSON.stringify(["NextJS", "TailwindCSS", "TypeScript", "Prisma"]),
      link: "https://fantoni-softwares.vercel.app/",
      github: null,
      type: "Web",
      featured: false,
      year: "2025",
      status: "shipped",
      stars: 0,
      forks: 0,
    },
    {
      title: "MarcaAi | Agendamentos Inteligentes",
      description: "Plataforma Saas para prestadores de serviços.",
      longDescription: "Plataforma Saas para prestadores de serviços que dependem de agendamentos, que integra Google Agenda + Whatsapp + IA Models para fazer o atendimento automático.",
      imageUrl: null,
      technologies: JSON.stringify(["NextJS", "TailwindCSS", "TypeScript", "Drizzle"]),
      link: "https://marcaaii.vercel.app/",
      github: null,
      type: "Saas",
      featured: true,
      year: "2025",
      status: "in-progress",
      stars: 0,
      forks: 0,
    },
    {
      title: "Laura & Ponto | Eccomerce",
      description: "Eccomerce avançado para artesão.",
      longDescription: "Este projeto é um Eccomerce para uma artesão que havia a necessidade de vender pela internet que pudesse emitir vários relatórios personalizados, soluções e integrações específicas, superando plataformas de template.",
      imageUrl: null,
      technologies: JSON.stringify(["NextJS", "TailwindCSS", "TypeScript", "Drizzle"]),
      link: "https://laura-e-ponto.vercel.app/",
      github: null,
      type: "Saas",
      featured: true,
      year: "2025",
      status: "shipped",
      stars: 0,
      forks: 0,
    },
    {
      title: "Ethos | Minha Gestão Pessoal",
      description: "Aplicação completa de gestão de projetos.",
      longDescription: "Este projeto é uma aplicação que compõe módulos de gestão de projetos, orçamentos, CRM e precificador por valor/projeto.",
      imageUrl: null,
      technologies: JSON.stringify(["NextJS", "TailwindCSS", "TypeScript", "Prisma"]),
      link: "https://ethos-theta.vercel.app/",
      github: null,
      type: "Saas",
      featured: true,
      year: "2025",
      status: "shipped",
      stars: 0,
      forks: 0,
    },
    {
      title: "Lumos | Finanças Pessoais",
      description: "Aplicação completa de gestão de finanças pessoais.",
      longDescription: "Este projeto é uma aplicação que compõe módulos de consulta de dados financeiros, contém um sistema de calculadora de renda fixa.",
      imageUrl: null,
      technologies: JSON.stringify(["NextJS", "TailwindCSS", "TypeScript", "Prisma"]),
      link: "https://lumos-app.vercel.app/",
      github: null,
      type: "Web",
      featured: true,
      year: "2025",
      status: "shipped",
      stars: 0,
      forks: 0,
    },
    {
      title: "Visualizer OCR",
      description: "Visualizador do processo de OCR.",
      longDescription: "Esta ferramenta visualiza o processo de OCR em etapas, com bounding boxes e logs de tempo para aprendizado e depuração.",
      imageUrl: null,
      technologies: JSON.stringify(["Python", "EasyOCR"]),
      link: "https://visualizer-ocr.streamlit.app",
      github: null,
      type: "Web",
      featured: true,
      year: "2025",
      status: "shipped",
      stars: 0,
      forks: 0,
    },
  ];

  for (const project of projects) {
    await prisma.project.create({
      data: project,
    });
  }

  console.log(`✅ Created ${projects.length} projects`);
}

main()
  .catch((e) => {
    console.error("❌ Error seeding database:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
