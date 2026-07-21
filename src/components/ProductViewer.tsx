"use client";

import { Suspense, useMemo } from 'react';
import { Canvas, useLoader } from '@react-three/fiber';
import { OrbitControls, Stage, useGLTF } from '@react-three/drei';
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader.js';

function StlMesh({ url }: { url: string }) {
  const geometry = useLoader(STLLoader, url);
  return (
    <mesh geometry={geometry} castShadow receiveShadow>
      <meshStandardMaterial color="#FF5A1F" metalness={0.2} roughness={0.4} />
    </mesh>
  );
}

function GlbModel({ url }: { url: string }) {
  const { scene } = useGLTF(url);
  const cloned = useMemo(() => scene.clone(), [scene]);
  return <primitive object={cloned} />;
}

export default function ProductViewer({
  url,
  format,
}: {
  url: string;
  format: 'stl' | 'glb';
}) {
  return (
    <Canvas shadows camera={{ position: [0, 0, 100], fov: 45 }} style={{ width: '100%', height: '100%' }}>
      <color attach="background" args={['#0B0F19']} />
      <Suspense fallback={null}>
        <Stage environment="city" intensity={0.6}>
          {format === 'stl' ? <StlMesh url={url} /> : <GlbModel url={url} />}
        </Stage>
      </Suspense>
      <OrbitControls enablePan enableZoom enableRotate />
    </Canvas>
  );
}
