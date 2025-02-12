
import { motion } from "framer-motion";
import ParticleBackground from "./ParticleBackground";
import { ArrowRight } from "lucide-react";

const Hero = () => {
  return (
    <div className="relative w-full h-screen overflow-hidden">
      <ParticleBackground particleCount={80} particleColor="#39FF14" backgroundColor="bg-dark" />
      <div className="absolute inset-0 flex flex-col items-center justify-center px-4">
        <motion.span
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-primary/10 text-primary px-4 py-1 rounded-full text-sm font-inter mb-6"
        >
          Revoluciona tu Empresa Solar
        </motion.span>
        
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-4xl md:text-6xl lg:text-7xl font-bold text-white text-center font-rajdhani mb-6"
        >
          SolarFluidity
        </motion.h1>
        
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="text-lg md:text-xl text-gray-300 text-center max-w-2xl mb-8 font-inter"
        >
          Gestión integral para proyectos solares. Simplifica tus cotizaciones,
          inventario y facturación en una sola plataforma.
        </motion.p>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="flex flex-col sm:flex-row gap-4"
        >
          <button className="px-8 py-3 bg-primary hover:bg-primary-hover text-dark-DEFAULT font-semibold rounded-lg transition-colors flex items-center gap-2 font-inter">
            Inicia tu Prueba
            <ArrowRight className="w-4 h-4" />
          </button>
          <button className="px-8 py-3 bg-dark-lighter hover:bg-dark-DEFAULT text-white font-semibold rounded-lg transition-colors font-inter border border-gray-700">
            Ver Demo
          </button>
        </motion.div>
      </div>
    </div>
  );
};

export default Hero;
