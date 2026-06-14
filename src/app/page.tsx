'use client';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment } from '@react-three/drei';
import { useState, Suspense } from 'react';
import { motion } from 'framer-motion';
import { Settings2, Zap, ShieldCheck, Sun, Layers } from 'lucide-react';

function ParametricCube({ width }: { width: number }) {
  return (
    <mesh scale={[width, 1, 1]}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial 
        color="#FF5A1F" 
        roughness={0.2}
        metalness={0.8}
      />
    </mesh>
  );
}

export default function GrillConfigurator() {
  const [width, setWidth] = useState(0.8);

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-[#0B0F19] text-slate-200 overflow-hidden">
      
      {/* 3D Canvas Area */}
      <div className="h-[50vh] lg:h-screen lg:w-2/3 relative">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-[#121A2F]/50 to-[#0B0F19] pointer-events-none z-0" />
        
        {/* Top Badges */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="absolute top-6 left-6 z-10 flex gap-3"
        >
          <div className="glass-panel px-4 py-2 rounded-full flex items-center gap-2">
            <Sun className="w-4 h-4 text-[#FF5A1F]" />
            <span className="text-sm font-semibold tracking-wide">SolarFluidity Pro</span>
          </div>
          <div className="glass-panel px-3 py-2 rounded-full flex items-center">
            <span className="text-xs text-slate-400 font-mono">v5.1.1</span>
          </div>
        </motion.div>

        {/* 3D Scene */}
        <div className="w-full h-full relative z-10">
          <Canvas camera={{ position: [2.5, 2, 2.5], fov: 45 }}>
            <Suspense fallback={null}>
              <ambientLight intensity={0.5} />
              <directionalLight position={[10, 10, 5]} intensity={1.5} />
              <pointLight position={[-10, -10, -10]} intensity={0.5} color="#0B0F19" />
              <Environment preset="city" />
              <ParametricCube width={width} />
              <OrbitControls enableDamping autoRotate autoRotateSpeed={0.8} />
            </Suspense>
          </Canvas>
        </div>
      </div>

      {/* Sidebar Controls */}
      <motion.div 
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        transition={{ type: "spring", stiffness: 70, damping: 20 }}
        className="glass-panel p-8 lg:w-1/3 flex flex-col justify-between z-20 border-l border-white/5 shadow-2xl relative"
      >
        <div className="space-y-8">
          
          <div>
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
              className="inline-flex items-center justify-center p-2 bg-[#FF5A1F]/10 rounded-xl mb-4 text-[#FF5A1F] border border-[#FF5A1F]/20"
            >
              <Settings2 className="w-6 h-6" />
            </motion.div>
            <h1 className="text-3xl font-bold text-white tracking-tight">Configurador 3D</h1>
            <p className="text-slate-400 mt-2 text-sm leading-relaxed">
              Ajusta las proporciones de tu modelo paramétrico en tiempo real. Renderizado acelerado por hardware sin plugins.
            </p>
          </div>

          <div className="p-5 bg-white/5 rounded-2xl border border-white/10 space-y-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm font-medium text-slate-300">
                <Layers className="w-4 h-4 text-[#FF5A1F]" />
                <span>Ancho Total (Eje X)</span>
              </div>
              <span className="text-lg font-mono text-[#FF5A1F]">{width.toFixed(2)} m</span>
            </div>
            
            <div className="relative pt-2">
              <input
                type="range"
                min={0.6}
                max={1.5}
                step={0.01}
                value={width}
                onChange={(e) => setWidth(Number(e.target.value))}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-slate-500 mt-2 font-mono">
                <span>0.6m</span>
                <span>1.5m</span>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-3 text-sm text-slate-400">
              <Zap className="w-4 h-4 text-yellow-500" />
              <span>Exportación instantánea a STEP y GLB</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-slate-400">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              <span>Cálculo de despiece automático</span>
            </div>
          </div>
        </div>

        <motion.div 
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="mt-10"
        >
          <button className="w-full bg-gradient-to-r from-[#FF5A1F] to-[#E04A15] hover:from-[#E04A15] hover:to-[#C23F10] text-white font-semibold py-4 px-6 rounded-xl shadow-[0_0_20px_rgba(255,90,31,0.3)] transition-all flex items-center justify-center gap-2">
            Hacer Upgrade a Pro <span className="opacity-80 font-normal">($99/mes)</span>
          </button>
        </motion.div>
      </motion.div>
    </div>
  );
}
