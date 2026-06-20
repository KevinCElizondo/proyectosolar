'use client';

import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF } from '@react-three/drei';
import { useState, Suspense } from 'react';
import { useRouter } from 'next/navigation';

function GrillAssembly({ width }: { width: number }) {
  // Nota: Si el archivo /models/grill/grill-separated.glb no existe, 
  // R3F arrojará un error de carga de red (404). 
  // Debes exportar tu diseño de FreeCAD y colocarlo en public/models/grill/
  const { nodes } = useGLTF('/models/grill/grill-separated.glb') as any;
  const baseWidth = 0.8;   // ancho original del diseño
  const scaleX = width / baseWidth;
  const offset = width / 2 - baseWidth / 2;

  // Renderizamos los meshes basándonos en los nombres de las capas definidos en el Master Doc
  return (
    <group>
      <mesh geometry={nodes.CenterBody.geometry} material={nodes.CenterBody.material} scale={[scaleX, 1, 1]} />
      <mesh geometry={nodes.LeftRail.geometry} position={[-offset, 0, 0]} material={nodes.LeftRail.material} />
      <mesh geometry={nodes.RightRail.geometry} position={[offset, 0, 0]} material={nodes.RightRail.material} />
      <mesh geometry={nodes.Wheels.geometry} position={[-offset, -0.4, 0]} material={nodes.Wheels.material} />
      <mesh geometry={nodes.Wheels.geometry} position={[offset, -0.4, 0]} material={nodes.Wheels.material} />
    </group>
  );
}

// Un fallback visual temporal en caso de que el modelo aún no esté disponible
function PlaceholderGrill({ width }: { width: number }) {
  const baseWidth = 0.8;
  const scaleX = width / baseWidth;
  const offset = width / 2 - baseWidth / 2;

  return (
    <group>
      {/* Center Body Placeholder */}
      <mesh scale={[scaleX, 1, 1]}>
        <boxGeometry args={[baseWidth, 1.2, 0.6]} />
        <meshStandardMaterial color="#FF5A1F" wireframe />
      </mesh>
      {/* Rails Placeholders */}
      <mesh position={[-offset, 0, 0]}>
        <boxGeometry args={[0.05, 1.2, 0.65]} />
        <meshStandardMaterial color="#475569" />
      </mesh>
      <mesh position={[offset, 0, 0]}>
        <boxGeometry args={[0.05, 1.2, 0.65]} />
        <meshStandardMaterial color="#475569" />
      </mesh>
    </group>
  );
}

function ConfiguratorContent({ width }: { width: number }) {
  return (
    <Suspense fallback={<PlaceholderGrill width={width} />}>
      {/* Intercambiar PlaceholderGrill por GrillAssembly cuando el GLB real exista */}
      <PlaceholderGrill width={width} />
      {/* <GrillAssembly width={width} /> */}
    </Suspense>
  );
}

interface GrillConfiguratorProps {
  isEmbed?: boolean;
  hideCart?: boolean;
  initialWidth?: number;
}

export default function GrillConfigurator({
  isEmbed = false,
  hideCart = false,
  initialWidth = 0.8,
}: GrillConfiguratorProps = {}) {
  const [width, setWidth] = useState(initialWidth);
  const router = useRouter();

  return (
    <div className="flex flex-col lg:flex-row gap-8 p-4 bg-[#121A2F] rounded-3xl border border-white/5 shadow-2xl overflow-hidden">
      <div className="h-[500px] w-full lg:w-2/3 bg-[#0B0F19] rounded-2xl relative">
        <Canvas camera={{ position: [2, 1.5, 2], fov: 45 }}>
          <ambientLight intensity={0.5} />
          <directionalLight position={[5, 5, 5]} intensity={1} />
          <pointLight position={[-5, -5, -5]} intensity={0.5} />
          <ConfiguratorContent width={width} />
          <OrbitControls enableDamping minDistance={1.5} maxDistance={5} />
        </Canvas>
        <div className="absolute bottom-4 left-4 text-xs text-slate-500 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          Renderizado paramétrico activo
        </div>
      </div>
      
      <div className="p-6 lg:p-8 space-y-6 flex-1 flex flex-col justify-center">
        <div>
          <h3 className="text-2xl font-bold text-white mb-2">Parrilla Híbrida Pro</h3>
          <p className="text-slate-400 text-sm">
            Configura el tamaño de tu parrilla en tiempo real. La estructura central se escala mientras los rieles y accesorios mantienen sus dimensiones originales sin deformarse.
          </p>
        </div>

        <div className="space-y-4 bg-white/5 p-6 rounded-2xl border border-white/10">
          <div className="flex justify-between items-center">
            <label className="text-sm font-medium text-slate-300">Ancho total</label>
            <span className="text-xl font-bold text-[#FF5A1F]">{width.toFixed(2)} m</span>
          </div>
          <input
            type="range"
            min={0.6}
            max={1.5}
            step={0.01}
            value={width}
            onChange={(e) => setWidth(Number(e.target.value))}
            className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-[#FF5A1F]"
          />
          <div className="flex justify-between text-xs text-slate-500">
            <span>0.60 m</span>
            <span>1.50 m</span>
          </div>
        </div>

        {!hideCart && (
          <div className="pt-4 border-t border-white/10">
            <button 
              onClick={() => {
                if (isEmbed) {
                  window.parent.postMessage({ type: 'ADD_TO_CART', product: 'grill', width }, '*');
                } else {
                  router.push(`/checkout?product=grill&width=${width}`);
                }
              }}
              className="w-full py-3 px-4 rounded-xl bg-[#FF5A1F] hover:bg-[#E04A15] text-white font-bold transition-colors shadow-[0_0_15px_rgba(255,90,31,0.2)]"
            >
              Añadir al Carrito - $1,199
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
