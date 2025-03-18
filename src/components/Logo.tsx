
import { motion, useAnimation, animate } from 'framer-motion';
import { useEffect, useState } from 'react';

export const Logo = () => {
  const [colorIndex, setColorIndex] = useState(0);
  
  // Array de colores vibrantes para la animación
  const colors = [
    '#39FF14', // Verde neón
    '#00FFFF', // Azul cian
    '#FF36FF', // Magenta
    '#14F0FF', // Azul eléctrico
    '#26C9FF', // Azul celeste
    '#00E676', // Verde esmeralda
  ];

  useEffect(() => {
    // Cambiar color cada 3 segundos
    const interval = setInterval(() => {
      setColorIndex((prevIndex) => (prevIndex + 1) % colors.length);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center gap-3"
    >
      <motion.svg
        width="64"
        height="64"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        animate={{ filter: 'drop-shadow(0 0 8px ' + colors[colorIndex] + ')' }}
        transition={{ duration: 1.5, ease: 'easeInOut' }}
      >
        {/* Rayo estilizado */}
        <motion.path
          d="M13 3L4 14h7l-2 7 9-11h-7l2-7z"
          fill={colors[colorIndex]}
          animate={{ fill: colors[colorIndex] }}
          transition={{ duration: 1.5, ease: 'easeInOut' }}
        />
      </motion.svg>
      <span className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
        SolarFluidity
      </span>
    </motion.div>
  );
};

export default Logo;
