"use client";

import { useEffect, useRef } from "react";

interface OrbitingParticle {
  angle: number;
  radius: number;
  speed: number;
  size: number;
  life: number;
  baseRadius: number;
}

const MAX_PARTICLES = 40;
const ORBIT_RADIUS = 180;
const PARTICLE_SIZE = 2;

export function ProfileCanvasEffect() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<OrbitingParticle[]>([]);
  const animationFrameRef = useRef<number>();
  const centerRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", {
      alpha: true,
      desynchronized: true,
    });
    if (!ctx) return;

    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "low";

    // Inicializar partículas orbitando
    const initParticles = () => {
      particlesRef.current = [];
      for (let i = 0; i < MAX_PARTICLES; i++) {
        particlesRef.current.push({
          angle: (Math.PI * 2 * i) / MAX_PARTICLES,
          radius: ORBIT_RADIUS + (Math.random() - 0.5) * 30,
          speed: 0.005 + Math.random() * 0.01,
          size: 1.5 + Math.random() * 1.5,
          life: 0.5 + Math.random() * 0.5,
          baseRadius: ORBIT_RADIUS + (Math.random() - 0.5) * 30,
        });
      }
    };

    const resizeCanvas = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = 400 * dpr;
      canvas.height = 400 * dpr;
      canvas.style.width = "400px";
      canvas.style.height = "400px";
      ctx.scale(dpr, dpr);
      
      centerRef.current = { x: 200, y: 200 };
      initParticles();
    };

    resizeCanvas();
    
    const resizeHandler = () => {
      resizeCanvas();
    };
    window.addEventListener("resize", resizeHandler, { passive: true });

    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, 400, 400);

      const center = centerRef.current;
      const particles = particlesRef.current;

      // Atualizar e desenhar partículas orbitando
      for (let i = 0; i < particles.length; i++) {
        const particle = particles[i];
        if (!particle) continue;

        // Atualizar ângulo (órbita)
        particle.angle += particle.speed;
        
        // Variação suave do raio (efeito pulsante)
        particle.radius = particle.baseRadius + Math.sin(particle.angle * 2) * 10;
        
        // Calcular posição
        const x = center.x + Math.cos(particle.angle) * particle.radius;
        const y = center.y + Math.sin(particle.angle) * particle.radius;

        // Desenhar partícula com brilho
        const alpha = particle.life * 0.6;
        ctx.fillStyle = `rgba(0, 200, 150, ${alpha})`;
        ctx.beginPath();
        ctx.arc(x, y, particle.size, 0, Math.PI * 2);
        ctx.fill();
        
        // Halo externo
        ctx.fillStyle = `rgba(0, 200, 150, ${alpha * 0.3})`;
        ctx.beginPath();
        ctx.arc(x, y, particle.size * 2, 0, Math.PI * 2);
        ctx.fill();
      }

      // Desenhar conexões entre partículas próximas
      ctx.strokeStyle = "rgba(0, 200, 150, 0.2)";
      ctx.lineWidth = 0.5;
      
      for (let i = 0; i < particles.length; i++) {
        const particle1 = particles[i];
        if (!particle1) continue;
        
        const x1 = center.x + Math.cos(particle1.angle) * particle1.radius;
        const y1 = center.y + Math.sin(particle1.angle) * particle1.radius;
        
        // Conectar com partículas próximas (índice adjacente)
        const nextIndex = (i + 1) % particles.length;
        const particle2 = particles[nextIndex];
        if (particle2) {
          const x2 = center.x + Math.cos(particle2.angle) * particle2.radius;
          const y2 = center.y + Math.sin(particle2.angle) * particle2.radius;
          
          const dx = x1 - x2;
          const dy = y1 - y2;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < 50) {
            const alpha = (1 - distance / 50) * 0.2;
            ctx.strokeStyle = `rgba(0, 200, 150, ${alpha})`;
            ctx.beginPath();
            ctx.moveTo(x1, y1);
            ctx.lineTo(x2, y2);
            ctx.stroke();
          }
        }
      }

      // Desenhar anel externo pulsante
      const pulse = Math.sin(Date.now() * 0.002) * 0.3 + 0.7;
      const ringRadius = ORBIT_RADIUS + 20;
      ctx.strokeStyle = `rgba(0, 200, 150, ${pulse * 0.15})`;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(center.x, center.y, ringRadius, 0, Math.PI * 2);
      ctx.stroke();

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", resizeHandler);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none z-10"
      style={{ background: "transparent" }}
    />
  );
}
