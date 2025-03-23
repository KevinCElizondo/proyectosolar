import React from "react";
import { motion } from "framer-motion";

interface OptimizedBackgroundProps {
  backgroundColor?: string;
  containerRef?: React.RefObject<HTMLDivElement>;
}

/**
 * Componente de fondo optimizado que reemplaza el costoso sistema de partículas
 * con un fondo estático elegante usando degradados y elementos decorativos ligeros.
 */
const OptimizedBackground = ({
  backgroundColor = "bg-dark",
  containerRef
}: OptimizedBackgroundProps) => {
  return (
    <div className={`${backgroundColor} absolute inset-0 w-full h-full overflow-hidden z-0`}>
      {/* Gradiente principal */}
      <div 
        className="absolute inset-0 bg-gradient-to-br from-dark via-dark to-purple-950"
        style={{ opacity: 0.7 }}
      />
      
      {/* Puntos decorativos (ligeros) */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-[10%] left-[20%] w-1.5 h-1.5 rounded-full bg-[#39FF14]"></div>
        <div className="absolute top-[15%] right-[15%] w-1 h-1 rounded-full bg-[#00FFFF]"></div>
        <div className="absolute top-[60%] left-[50%] w-1.5 h-1.5 rounded-full bg-[#00E676]"></div>
        <div className="absolute top-[80%] right-[30%] w-1 h-1 rounded-full bg-[#26C9FF]"></div>
        <div className="absolute top-[75%] left-[33%] w-1 h-1 rounded-full bg-[#14F0FF]"></div>
        <div className="absolute top-[60%] right-[10%] w-1.5 h-1.5 rounded-full bg-[#00FFFF]"></div>
        <div className="absolute top-[10%] left-[10%] w-1 h-1 rounded-full bg-[#39FF14]"></div>
        <div className="absolute top-[20%] left-[40%] w-1 h-1 rounded-full bg-[#26C9FF]"></div>
        <div className="absolute top-[30%] right-[25%] w-1 h-1 rounded-full bg-[#00E676]"></div>
        <div className="absolute top-[90%] right-[45%] w-1.5 h-1.5 rounded-full bg-[#14F0FF]"></div>
      </div>
      
      {/* Líneas decorativas (ligeras) */}
      <svg className="absolute inset-0 w-full h-full opacity-10" xmlns="http://www.w3.org/2000/svg">
        <line x1="20%" y1="10%" x2="50%" y2="60%" stroke="#39FF14" strokeWidth="0.5" />
        <line x1="50%" y1="60%" x2="70%" y2="80%" stroke="#00E676" strokeWidth="0.5" />
        <line x1="85%" y1="15%" x2="50%" y2="60%" stroke="#00FFFF" strokeWidth="0.5" />
        <line x1="33%" y1="75%" x2="50%" y2="60%" stroke="#14F0FF" strokeWidth="0.5" />
        <line x1="90%" y1="60%" x2="70%" y2="80%" stroke="#00FFFF" strokeWidth="0.5" />
      </svg>
      
      {/* Resplandor superior */}
      <motion.div 
        className="absolute top-0 left-1/2 w-full h-96 rounded-full"
        style={{ 
          background: "radial-gradient(circle, rgba(57, 255, 20, 0.05) 0%, rgba(0, 0, 0, 0) 70%)",
          transform: "translate(-50%, -50%)"
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      />
      
      {/* Resplandor derecho */}
      <motion.div 
        className="absolute top-1/2 right-0 w-96 h-96 rounded-full"
        style={{ 
          background: "radial-gradient(circle, rgba(0, 255, 255, 0.05) 0%, rgba(0, 0, 0, 0) 70%)",
          transform: "translate(50%, -50%)"
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0.5 }}
      />
    </div>
  );
};

export default OptimizedBackground;
