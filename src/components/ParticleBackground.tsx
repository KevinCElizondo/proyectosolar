
import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

interface ParticleBackgroundProps {
  particleCount?: number;
  backgroundColor?: string;
  containerRef?: React.RefObject<HTMLDivElement>;
}

const ParticleBackground = ({
  particleCount = 180,
  backgroundColor = "bg-dark",
  containerRef
}: ParticleBackgroundProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  // Colores vibrantes para partículas
  const particleColors = [
    "#39FF14", // Verde neón
    "#00FFFF", // Cian
    "#00E676", // Verde esmeralda
    "#26C9FF", // Azul celeste
    "#14F0FF", // Azul eléctrico
  ];

  useEffect(() => {
    // Referencias
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Obtener el elemento contenedor
    const container = containerRef?.current;
    if (!container) return;

    // Configuración de tamaño inicial
    const updateCanvasSize = () => {
      const rect = container.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height;
      setDimensions({ width: rect.width, height: rect.height });
      console.log(`Canvas dimensionado: ${rect.width}x${rect.height}`);
    };

    updateCanvasSize();
    window.addEventListener('resize', updateCanvasSize);

    // Clase para manejar las partículas
    class Particle {
      x: number;
      y: number;
      size: number;
      speedX: number;
      speedY: number;
      color: string;
      connections: number;

      constructor(x?: number, y?: number) {
        // Si se proporciona coordenada, la usamos, sino es aleatoria
        this.x = x !== undefined ? x : Math.random() * canvas.width;
        this.y = y !== undefined ? y : Math.random() * canvas.height;
        this.size = Math.random() * 2 + 1;
        this.speedX = (Math.random() - 0.5) * 0.7;
        this.speedY = (Math.random() - 0.5) * 0.7;
        this.color = particleColors[Math.floor(Math.random() * particleColors.length)];
        this.connections = 0;
      }

      update() {
        this.x += this.speedX;
        this.y += this.speedY;

        // Movimiento envolvente
        if (this.x < 0) this.x = canvas.width;
        if (this.x > canvas.width) this.x = 0;
        if (this.y < 0) this.y = canvas.height;
        if (this.y > canvas.height) this.y = 0;
      }

      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.shadowBlur = 15;
        ctx.shadowColor = this.color;
        ctx.fill();
        ctx.closePath();
      }

      // Comprueba si conecta con otra partícula
      connectTo(particles: Particle[]) {
        const maxDistance = 150; // Distancia máxima para conectar
        const maxConnections = 3; // Límite de conexiones para evitar sobrecarga
        
        if (this.connections >= maxConnections) return;

        for (const particle of particles) {
          if (particle === this || particle.connections >= maxConnections) continue;
          
          const dx = this.x - particle.x;
          const dy = this.y - particle.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < maxDistance) {
            const alpha = 1 - (distance / maxDistance);
            ctx.beginPath();
            ctx.strokeStyle = this.color;
            ctx.lineWidth = 0.4;
            ctx.globalAlpha = alpha * 0.8;
            ctx.moveTo(this.x, this.y);
            ctx.lineTo(particle.x, particle.y);
            ctx.stroke();
            ctx.globalAlpha = 1;
            
            this.connections++;
            particle.connections++;
            
            if (this.connections >= maxConnections) break;
          }
        }
      }
    }

    // Distribución estratégica de partículas para garantizar cobertura total
    const createParticles = () => {
      const particles: Particle[] = [];
      const totalWidth = canvas.width;
      const totalHeight = canvas.height;
      
      // Distribución garantizada en toda la pantalla dividida en 4 secciones
      const sections = [0, 0.25, 0.5, 0.75]; // Divisiones horizontales
      const particlesPerSection = Math.floor(particleCount / 4);
      
      sections.forEach(sectionStart => {
        const sectionWidth = totalWidth * 0.25; // 25% del ancho total
        const sectionX = totalWidth * sectionStart;
        
        // Colocar partículas en cada sección
        for (let i = 0; i < particlesPerSection; i++) {
          const x = sectionX + Math.random() * sectionWidth;
          const y = Math.random() * totalHeight;
          particles.push(new Particle(x, y));
        }
      });
      
      // Partículas adicionales para la mitad derecha (40% más)
      const rightSideExtra = Math.floor(particleCount * 0.4);
      for (let i = 0; i < rightSideExtra; i++) {
        const x = (totalWidth * 0.5) + Math.random() * (totalWidth * 0.5);
        const y = Math.random() * totalHeight;
        particles.push(new Particle(x, y));
      }
      
      return particles;
    };

    const particles = createParticles();
    
    // Animación de partículas
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Resetear contador de conexiones
      particles.forEach(p => p.connections = 0);
      
      // Actualizar y dibujar partículas
      particles.forEach(p => {
        p.update();
        p.draw();
      });
      
      // Conectar partículas entre sí
      particles.forEach(p => p.connectTo(particles));
      
      animationRef.current = requestAnimationFrame(animate);
    };
    
    // Iniciar animación
    animate();
    
    // Limpieza al desmontar
    return () => {
      window.removeEventListener('resize', updateCanvasSize);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [particleCount, containerRef]);

  return (
    <div className={`${backgroundColor} absolute inset-0 w-full h-full overflow-hidden z-0`}>
      <motion.canvas
        ref={canvasRef}
        className="absolute inset-0"
        style={{ 
          width: '100%', 
          height: '100%',
          display: 'block',
          position: 'absolute',
          left: 0,
          top: 0,
          right: 0,
          bottom: 0 
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.8 }}
        transition={{ duration: 1 }}
      />
    </div>
  );
};

export default ParticleBackground;
