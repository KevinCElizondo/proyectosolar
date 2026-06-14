'use client';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { useState } from 'react';

function ParametricCube({ width }: { width: number }) {
  return (
    <mesh scale={[width, 1, 1]}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="orange" />
    </mesh>
  );
}

export default function GrillConfigurator() {
  const [width, setWidth] = useState(0.8);

  return (
    <div className="flex flex-col lg:flex-row gap-4 p-4 min-h-screen bg-gray-50">
      <div className="h-[500px] lg:w-2/3 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden relative">
        <div className="absolute top-4 left-4 z-10 bg-white/80 px-3 py-1 rounded-full text-sm font-medium text-gray-700 backdrop-blur-sm">
          SolarFluidity v5.1.1 ☀️
        </div>
        <Canvas camera={{ position: [2, 2, 2], fov: 45 }}>
          <ambientLight intensity={0.4} />
          <directionalLight position={[5, 5, 5]} intensity={1} />
          <ParametricCube width={width} />
          <OrbitControls enableDamping autoRotate autoRotateSpeed={0.5} />
        </Canvas>
      </div>
      <div className="p-6 space-y-6 lg:w-1/3 bg-white rounded-xl shadow-sm border border-gray-100">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Configurador Pro</h2>
          <p className="text-sm text-gray-500 mt-1">Ajusta el ancho del modelo paramétrico en tiempo real.</p>
        </div>
        
        <div className="space-y-3">
          <label className="flex justify-between text-sm font-medium text-gray-700">
            <span>Ancho total</span>
            <span className="text-blue-600">{width.toFixed(2)} m</span>
          </label>
          <input
            type="range"
            min={0.6}
            max={1.5}
            step={0.01}
            value={width}
            onChange={(e) => setWidth(Number(e.target.value))}
            className="w-full accent-blue-600"
          />
        </div>

        <div className="pt-6 border-t border-gray-100">
          <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors shadow-sm">
            Hacer Upgrade a Pro ($99/mes)
          </button>
        </div>
      </div>
    </div>
  );
}
