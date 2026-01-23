"use client";

import { useEffect, useRef } from "react";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  size: number;
}

const MAX_PARTICLES = 50;
const CONNECTION_DISTANCE = 120;
const MAX_CONNECTIONS_PER_PARTICLE = 3;

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
      if (now - mouseThrottle < 16) return; // ~60fps throttle
      mouseThrottle = now;

      mouseRef.current = { x: e.clientX, y: e.clientY };

      // Limitar criação de partículas e número total
      if (particlesRef.current.length < MAX_PARTICLES) {
        particlesRef.current.push({
          x: e.clientX,
          y: e.clientY,
          vx: (Math.random() - 0.5) * 1.5,
          vy: (Math.random() - 0.5) * 1.5,
          life: 1,
          size: Math.random() * 1.5 + 0.5,
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

        particle.x += particle.vx;
        particle.y += particle.vy;
        particle.life -= 0.015;
        particle.vx *= 0.99;
        particle.vy *= 0.99;

        // Remover partículas mortas ou fora da tela
        if (particle.life <= 0 || 
            particle.x < -50 || particle.x > width + 50 ||
            particle.y < -50 || particle.y > height + 50) {
          particles.splice(i, 1);
          continue;
        }

        // Desenhar partícula (sem shadowBlur - muito pesado)
        const alpha = particle.life * 0.5;
        ctx.fillStyle = `rgba(0, 200, 150, ${alpha})`;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fill();
      }

      // Desenhar conexões otimizado (limitar verificações)
      ctx.strokeStyle = "rgba(0, 200, 150, 0.15)";
      ctx.lineWidth = 0.5;
      
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
          if (distSq < CONNECTION_DISTANCE * CONNECTION_DISTANCE) {
            const distance = Math.sqrt(distSq);
            const alpha = (1 - distance / CONNECTION_DISTANCE) * 0.15;
            
            ctx.strokeStyle = `rgba(0, 200, 150, ${alpha})`;
            ctx.beginPath();
            ctx.moveTo(particle1.x, particle1.y);
            ctx.lineTo(particle2.x, particle2.y);
            ctx.stroke();
            
            connections++;
          }
        }
      }

      // Desenhar efeito do mouse (simplificado para performance)
      if (mouseRef.current.x && mouseRef.current.y) {
        // Criar gradiente apenas quando necessário (mais leve que a cada frame)
        const gradient = ctx.createRadialGradient(
          mouseRef.current.x,
          mouseRef.current.y,
          0,
          mouseRef.current.x,
          mouseRef.current.y,
          100
        );
        gradient.addColorStop(0, "rgba(0, 200, 150, 0.06)");
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
