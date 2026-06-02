import React, { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, ContactShadows } from '@react-three/drei';

export default function EmbedViewer() {
    const { storeId } = useParams<{ storeId: string }>();
    const [searchParams] = useSearchParams();
    const productId = searchParams.get('product');

    const [storeName, setStoreName] = useState<string>('Cargando tienda...');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchStore() {
            if (!storeId) {
                setError("ID de tienda no especificado");
                setLoading(false);
                return;
            }

            try {
                const { data, error } = await supabase
                    .from('stores')
                    .select('name, primary_color')
                    .eq('id', storeId)
                    .single();

                if (error) throw error;
                if (data) {
                    setStoreName(data.name);
                } else {
                    setError("Tienda no encontrada");
                }
            } catch (err: any) {
                console.error("Error fetching store:", err);
                setError("Error al cargar la tienda");
            } finally {
                setLoading(false);
            }
        }

        fetchStore();
    }, [storeId]);

    if (error) {
        return (
            <div className="w-full h-screen flex items-center justify-center bg-gray-50 text-gray-800 p-4 text-center">
                <p className="font-medium text-red-600">{error}</p>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="w-full h-screen flex items-center justify-center bg-gray-50">
                <div className="animate-pulse flex flex-col items-center">
                    <div className="h-8 w-8 bg-gray-200 rounded-full mb-4"></div>
                    <div className="h-4 w-32 bg-gray-200 rounded"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full h-screen relative bg-gradient-to-b from-gray-50 to-gray-200">
            {/* Store UI Overlay */}
            <div className="absolute top-0 left-0 w-full p-4 flex justify-between items-center z-10 pointer-events-none">
                <h2 className="text-lg font-bold text-gray-800 drop-shadow-sm pointer-events-auto">
                    {storeName}
                </h2>
                {productId && (
                    <span className="text-xs bg-black/10 px-2 py-1 rounded backdrop-blur-sm pointer-events-auto">
                        Producto: {productId}
                    </span>
                )}
            </div>

            {/* 3D Canvas */}
            <Canvas shadows camera={{ position: [0, 2, 5], fov: 45 }}>
                <ambientLight intensity={0.5} />
                <directionalLight position={[5, 5, 5]} intensity={1} castShadow />
                
                {/* Basic placeholder mesh for Week 1 MVP */}
                <mesh castShadow receiveShadow position={[0, 0.5, 0]}>
                    <boxGeometry args={[1, 1, 1]} />
                    <meshStandardMaterial color="#2C3E50" />
                </mesh>

                {/* Soft shadows */}
                <ContactShadows position={[0, 0, 0]} opacity={0.4} scale={10} blur={2} far={4} />

                {/* Controls */}
                <OrbitControls makeDefault autoRotate autoRotateSpeed={1.5} />
                <Environment preset="city" />
            </Canvas>

            {/* Watermark for free plan (we'll make this conditional later based on the 'plan' column) */}
            <div className="absolute bottom-2 right-2 z-10 pointer-events-auto">
                <a 
                    href="https://solarfluidity.com" 
                    target="_blank" 
                    rel="noreferrer"
                    className="text-[10px] text-gray-500 hover:text-gray-800 bg-white/50 backdrop-blur-sm px-2 py-1 rounded transition-colors"
                >
                    Powered by SolarFluidity 3D
                </a>
            </div>
        </div>
    );
}
