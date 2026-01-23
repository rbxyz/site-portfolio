"use client";

import { useEffect, useRef } from "react";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  size: number;
  baseSize: number;
}

const MAX_PARTICLES = 60;
const CONNECTION_DISTANCE = 150;
const MAX_CONNECTIONS_PER_PARTICLE = 4;
const MOUSE_ATTRACTION = 0.02;

export function CanvasMouseEffect() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const mouseRef = useRef({ x: 0, y: 0 });
  const animationFrameRef = useRef<number>();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Otimizações de performance do canvas
    const ctx = canvas.getContext("2d", {
      alpha: true,
      desynchronized: true,
    });
    if (!ctx) return;

    // Configurações de performance
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "low";

    // Set canvas size
    const resizeCanvas = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2); // Limitar DPR para performance
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      ctx.scale(dpr, dpr);
    };

    resizeCanvas();
    
    const resizeHandler = () => {
      resizeCanvas();
    };
    window.addEventListener("resize", resizeHandler, { passive: true });

    // Throttle mouse move para performance
    let mouseThrottle = 0;
    const handleMouseMove = (e: MouseEvent) => {
      const now = Date.now();
      if (now - mouseThrottle < 12) return; // ~80fps throttle para mais responsividade
      mouseThrottle = now;

      mouseRef.current = { x: e.clientX, y: e.clientY };

      // Criar mais partículas por movimento para efeito mais expressivo
      const particlesToCreate = 2;
      for (let i = 0; i < particlesToCreate && particlesRef.current.length < MAX_PARTICLES; i++) {
        const baseSize = Math.random() * 2.5 + 1.5; // Partículas maiores
        particlesRef.current.push({
          x: e.clientX + (Math.random() - 0.5) * 10,
          y: e.clientY + (Math.random() - 0.5) * 10,
          vx: (Math.random() - 0.5) * 3, // Velocidade maior
          vy: (Math.random() - 0.5) * 3,
          life: 1,
          size: baseSize,
          baseSize,
        });
      }
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });

    // Animation loop otimizado
    const animate = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      
      // Limpar canvas de forma eficiente
      ctx.clearRect(0, 0, width, height);

      const particles = particlesRef.current;
      const particleCount = particles.length;

      // Atualizar e desenhar partículas
      for (let i = particleCount - 1; i >= 0; i--) {
        const particle = particles[i];
        if (!particle) continue;

        // Atração suave em direção ao mouse (mais expressivo)
        if (mouseRef.current.x && mouseRef.current.y) {
          const dx = mouseRef.current.x - particle.x;
          const dy = mouseRef.current.y - particle.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance > 0 && distance < 200) {
            const force = MOUSE_ATTRACTION * (1 - distance / 200);
            particle.vx += (dx / distance) * force;
            particle.vy += (dy / distance) * force;
          }
        }

        particle.x += particle.vx;
        particle.y += particle.vy;
        particle.life -= 0.012; // Vida mais longa
        particle.vx *= 0.985; // Menos fricção para movimento mais fluido
        particle.vy *= 0.985;

        // Tamanho pulsante baseado na vida (mais expressivo)
        particle.size = particle.baseSize * (0.7 + particle.life * 0.3);

        // Remover partículas mortas ou fora da tela
        if (particle.life <= 0 || 
            particle.x < -100 || particle.x > width + 100 ||
            particle.y < -100 || particle.y > height + 100) {
          particles.splice(i, 1);
          continue;
        }

        // Desenhar partícula com brilho mais intenso
        const alpha = particle.life * 0.8; // Mais opaco
        const size = particle.size;
        
        // Partícula principal
        ctx.fillStyle = `rgba(0, 200, 150, ${alpha})`;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, size, 0, Math.PI * 2);
        ctx.fill();
        
        // Halo externo para mais visibilidade (otimizado)
        ctx.fillStyle = `rgba(0, 200, 150, ${alpha * 0.3})`;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, size * 1.8, 0, Math.PI * 2);
        ctx.fill();
      }

      // Desenhar conexões otimizado (limitar verificações) - mais visíveis
      for (let i = 0; i < particles.length; i++) {
        const particle1 = particles[i];
        if (!particle1) continue;
        
        let connections = 0;
        
        // Limitar verificações e conexões por partícula
        for (let j = i + 1; j < particles.length && connections < MAX_CONNECTIONS_PER_PARTICLE; j++) {
          const particle2 = particles[j];
          if (!particle2) continue;
          
          const dx = particle1.x - particle2.x;
          const dy = particle1.y - particle2.y;
          
          // Otimização: verificar distância ao quadrado primeiro (evita sqrt)
          const distSq = dx * dx + dy * dy;
          const maxDistSq = CONNECTION_DISTANCE * CONNECTION_DISTANCE;
          
          if (distSq < maxDistSq) {
            const distance = Math.sqrt(distSq);
            const normalizedDist = distance / CONNECTION_DISTANCE;
            
            // Conexões mais visíveis e expressivas
            const alpha = (1 - normalizedDist) * 0.4; // Mais opaco
            const lineWidth = (1 - normalizedDist) * 1.5 + 0.5; // Linha mais grossa
            
            ctx.strokeStyle = `rgba(0, 200, 150, ${alpha})`;
            ctx.lineWidth = lineWidth;
            ctx.beginPath();
            ctx.moveTo(particle1.x, particle1.y);
            ctx.lineTo(particle2.x, particle2.y);
            ctx.stroke();
            
            connections++;
          }
        }
      }

      // Desenhar efeito do mouse (mais expressivo e visível)
      if (mouseRef.current.x && mouseRef.current.y) {
        // Gradiente maior e mais visível
        const gradient = ctx.createRadialGradient(
          mouseRef.current.x,
          mouseRef.current.y,
          0,
          mouseRef.current.x,
          mouseRef.current.y,
          180
        );
        gradient.addColorStop(0, "rgba(0, 200, 150, 0.15)");
        gradient.addColorStop(0.5, "rgba(0, 200, 150, 0.08)");
        gradient.addColorStop(1, "rgba(0, 200, 150, 0)");

        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, width, height);
      }

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", resizeHandler);
      window.removeEventListener("mousemove", handleMouseMove);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ background: "transparent" }}
    />
  );
}
