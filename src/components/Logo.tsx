
import { motion } from 'framer-motion';

export const Logo = () => {
  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="flex items-center gap-2"
    >
      <svg
        width="48"
        height="48"
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="animate-glow"
      >
        <circle cx="24" cy="24" r="20" stroke="#39FF14" strokeWidth="2" />
        <path
          d="M24 12L36 30H12L24 12Z"
          fill="#39FF14"
          className="animate-float"
        />
        <circle cx="24" cy="24" r="4" fill="#39FF14" />
      </svg>
      <span className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
        SolarFluidity
      </span>
    </motion.div>
  );
};

export default Logo;
